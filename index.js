const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const db = require("./utils/db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./utils/bc");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({
    length: 6
});
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const s3Url = require("./config");
const amazonURL = s3Url.s3Url;

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage
    // limits: {
    //     fileSize: 2097152
    // }
});

// console.log(secretCode);
// const { requireLoggedOutUser } = require("./utils/middleware");

app.use(express.static("./public"));
app.use(express.json());

app.use(
    express.urlencoded({
        extended: false
    })
);

// app.use(
//     cookieSession({
//         secret: `I'm always angry.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// app.use(function(req, res, next) {
//     if (!req.session.userId) {
//         res.redirect("/welcome");
//     } else {
//         next();
//     }
// });

app.use(csurf());

app.use(function(req, res, next) {
    res.set("x-frame-options", "DENY");
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});

app.post("/welcome", (req, res) => {
    // console.log("req.body: ", req.body);
    const { password2, password, first, last, email } = req.body;
    console.log("password: ", password, "password2: ", password2);
    if (password !== "" && password === password2) {
        hash(password)
            .then(hashedPw => {
                db.addRegister(first, last, email, hashedPw)
                    .then(response => {
                        req.session.userId = response.rows[0].id;
                        console.log("req.session.userId: ", req.session.userId);
                        // })
                        // .then(response => {
                        // req.session.userId = response.rows[0].id;
                        // console.log("req.session.userId: ", req.session.userId);
                        // console.log("result from db.addRegister: ", result);
                        // if (first && last && email && hashedPw) {
                        console.log("registration succeed");
                        res.sendStatus(200);
                        // } else {
                        //     console.log("error in filling out the forms");
                        //     res.sendStatus(500);
                        // }
                    })
                    .catch(err => {
                        console.log("error in filling out the forms: ", err);
                        res.json({ filledForms: false });
                        // res.redirect("/");
                    });
                // });
            })
            .catch(err => {
                console.log("error in hashing the password: ", err);
                res.json({ hashedPass: false });
                // } else {
                //     res.json("register", {
                //         repeatPass: true
            });
    } else {
        console.log("error, passwords dont match: ");
        res.json({ matchedPass: false });
    }
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});

app.post("/login", (req, res) => {
    const { first, last } = req.body;
    req.session.first = first;
    req.session.last = last;
    const { email, password } = req.body;
    // if (email === "") {
    //     console.log("no email address");
    //     res.json({ email: false });
    // }
    db.getPass(email)
        .then(response => {
            req.session.userId = response.rows[0].id;
            const hashedPwInDb = response.rows[0].password;
            // console.log("hashedPwInDb: ", hashedPwInDb);
            compare(password, hashedPwInDb)
                .then(matchValue => {
                    if (matchValue) {
                        res.json({ passwordMatch: true });
                    } else {
                        res.json({
                            passwordMatch: false
                        });
                    }
                })
                .catch(err => {
                    console.log("err in compare: ", err);
                });
        })
        .catch(err => {
            console.log("err in db.getpass: ", err);
            res.json({
                errinGetpass: true
            });
        });
});

// app.get("/password/reset/start", (req, res) => {
//     if (req.session.userId) {
//         res.redirect("/");
//     }
//     res.sendFile(__dirname + "/index.html");
// });

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    db.compareEmail(email)
        .then(result => {
            // console.log("result: ", result);
            let verEmail = result.rows[0].email;
            // console.log("verEmail: ", verEmail);
            db.insertCode(verEmail, secretCode)
                .then(() => {
                    sendEmail(verEmail, "your code", secretCode)
                        .then(() => {
                            res.json({ codeSent: true });
                        })
                        .catch(err => {
                            console.log("err in sendEmail: ", err);
                        });
                })
                .catch(err => {
                    console.log("err in db.insertCode: ", err);
                });
            // }
        })
        .catch(err => {
            console.log("err in db.compareEmail: ", err);
            res.json({ errInDbCompareEmail: true });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    // console.log("filename: ", filename);
    if (req.file) {
        db.insertURL(filename, amazonURL, req.session.userId)
            .then(result => {
                // console.log("result from db.insertURL: ", result);
                res.json({ result });
            })
            .catch(err => {
                console.log("err in db.insertURL: ", err);
            });
        // let url = amazonURL + filename;
        // console.log("url: ", url);
        // res.json({ url: url });
    }
});
app.post("/uploadImage", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    // console.log("filename: ", filename);
    if (req.file) {
        db.insertURL(filename, amazonURL, req.session.userId)
            .then(result => {
                // console.log("result from db.insertURL: ", result);
                res.json({ result });
            })
            .catch(err => {
                console.log("err in db.insertURL: ", err);
            });
        // let url = amazonURL + filename;
        // console.log("url: ", url);
        // res.json({ url: url });
    }
});

app.post("/password/reset/verify", (req, res) => {
    const { code, password, email } = req.body;
    db.getCode(email)
        .then(result => {
            // console.log("result.rows: ", result.rows);
            let secondCode = result.rows[result.rows.length - 1].code;
            console.log(
                "secondCode (code sent and allready in database): ",
                secondCode
            );
            if (code === secondCode && password !== "") {
                console.log("codes are equal, the new password is: ", password);
                hash(password)
                    .then(hashedPw => {
                        // console.log("new hashed pw and id: ", hashedPw, email);
                        db.updatePass(hashedPw, email)
                            .then(result => {
                                console.log(
                                    "result after db.updatePass: ",
                                    result.rows[0].id
                                );
                                req.session.userId = result.rows[0].id;
                                res.json({ passwordChanged: true });
                            })
                            .catch(err => {
                                console.log(
                                    "error in updating the password: ",
                                    err
                                );
                                res.json({ passwordChanged: false });
                            });
                    })
                    .catch(err => {
                        console.log("error in hashing the password: ", err);
                        res.json({ hashedPass: false });
                    });
            }
        })

        .catch(err => {
            console.log("err in db.getCode: ", err);
            res.json({ code: false });
        });
});

app.get("/password/reset/verify", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});

app.get("/user", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    }
    let id = req.session.userId;
    db.getUserDetails(id).then(result => {
        // console.log("result from getUserDetails: ", result[0]);
        let details = result[0];
        res.json({ details });
    });
});

app.post("/bio", (req, res) => {
    let { bio } = req.body;
    let id = req.session.userId;
    console.log("bio: ", bio);
    db.insertBio(bio, id).then(result => {
        // console.log("result after db.insertBio: ", result.rows[0].bio);
        let newBio = result.rows[0].bio;
        res.json({ newBio, insertBio: true });
    });
    // db.getCode(email)
    //     .then(result => {
});

app.get("/user/:id.json", (req, res) => {
    let id = req.params.id;
    if (id == req.session.userId) {
        return res.json({
            redirecting: true
        });
    }
    console.log("this is req.params.id: ", id);
    db.getUserDetails(id)
        .then(result => {
            // console.log(
            //     "result from db.getUserDetails after /user/:id.json: ",
            //     result
            // );
            res.json({
                result
            });
        })
        .catch(err => {
            console.log(
                "error in db.getUserDetails after /user/:id.json: ",
                err
            );
        });
});

app.get("/users.json", async (req, res) => {
    try {
        const result = await db.getLastUsers();
        // console.log("result after db.getLastUsers: ", result);
        res.json({ result });
    } catch (err) {
        console.log("err after db.getLastUsers: ", err.message);
    }
});

app.post("/searching", (req, res) => {
    // console.log(req.body);
    let { searchUsers } = req.body;
    if (!searchUsers) {
        res.redirect("/users.json");
        return;
    }
    // console.log("searchUsers: ", searchUsers);
    db.getMatchingUsers(searchUsers)
        .then(result => {
            // console.log("result after db.getMatchingUsers: ", result);
            res.json({ result });
        })
        .catch(err => {
            console.log("err after db.getMatchingUsers: ", err);
        });
});

app.get("/initial-friendship-status/:id", async (req, res) => {
    try {
        let receiverId = req.params.id;
        let userId = req.session.userId;
        // console.log("receiverId: ", receiverId, "userId ", userId);
        const result = await db.checkRelationship(userId, receiverId);
        // console.log("result after db.checkRelationship: ", result);
        // if (!result[0]) {
        //     res.json({ buttonText: "Make Friend Request" });
        // } else
        if (result[0].accepted == true) {
            res.json({ buttonText: "End Friendship", wall: true });
        } else if (result[0].receiver_id == userId) {
            res.json({ buttonText: "Accept Friend Request" });
        } else if (result[0].receiver_id !== userId) {
            res.json({ buttonText: "Cancel Friend Request" });
        }
    } catch (err) {
        res.json({ buttonText: "Make Friend Request" });
        console.log("err after db.checkRelationship: ", err.message);
    }
});

app.post("/make-friend-request", (req, res) => {
    // console.log(req.body);
    let otherUserId = req.body.otherUserId;
    let userId = req.session.userId;
    // console.log("otherUserId: ", otherUserId, "userId: ", userId);
    db.insertRelationship(userId, otherUserId)
        .then(result => {
            // console.log("result after db.insertRelationship: ", result);
            res.json({ buttonText: "Cancel Friend Request" });
        })
        .catch(err => {
            console.log("err after db.insertRelationship: ", err);
        });
});

app.post("/cancel-friend-request", async (req, res) => {
    console.log("req.bosy after /cancel friend request: ", req.body);
    try {
        let otherUserId = req.body.otherUserId;
        let userId = req.session.userId;
        // console.log("otherUserId: ", otherUserId, "userId ", userId);
        const result = await db.deleteRelationship(userId, otherUserId);
        // console.log("result after db.deleteRelationship: ", result);
        res.json({ buttonText: "Make Friend Request" });
    } catch (err) {
        console.log("err after db.deleteRelationship: ", err.message);
    }
});

app.post("/accept-friend-request", async (req, res) => {
    console.log("req.bosy after /accept friend request: ", req.body);
    try {
        // console.log("req.body.otherUserId: ", req.body.otherUserId);
        let otherUserId = req.body.otherUserId;
        let userId = req.session.userId;
        // console.log("otherUserId: ", otherUserId, "userId ", userId);
        const result = await db.updateRelationship(userId, otherUserId);
        console.log("result after db.updateRelationship: ", result);
        res.json({ buttonText: "End Friendship", result: result });
    } catch (err) {
        console.log("err after db.updateRelationship: ", err.message);
    }
});

app.post("/end-friendship", async (req, res) => {
    console.log("req.bosy after /end-friendship: ", req.body);
    try {
        let otherUserId = req.body.otherUserId;
        let userId = req.session.userId;
        // console.log("otherUserId: ", otherUserId, "userId ", userId);
        const result = await db.deleteRelationship(userId, otherUserId);
        // console.log("result after db.deleteRelationship: ", result);
        res.json({ buttonText: "Make Friend Request" });
    } catch (err) {
        console.log("err after db.deleteRelationship: ", err.message);
    }
});

app.get("/friends-wannabes", async (req, res) => {
    try {
        // let receiverId = req.params.id;
        let userId = req.session.userId;
        // console.log("receiverId: ", receiverId, "userId ", userId);
        const result = await db.manageFriendship(userId);
        console.log("result after db.manageFriendship: ", result);
        res.json(result);
        // if (result[0].accepted == true) {
        //     res.json({ buttonText: "End Friendship" });
        // } else if (result[0].receiver_id == userId) {
        //     res.json({ buttonText: "Accept Friend Request" });
        // } else if (result[0].receiver_id !== userId) {
        //     res.json({ buttonText: "Cancel Friend Request" });
        // }
    } catch (err) {
        // res.json({ buttonText: "Make Friend Request" });
        console.log("err after db.manageFriendship: ", err.message);
    }
});

app.get("/userId", (req, res) => {
    const userId = req.session.userId;
    res.json({ userId });
});
app.get("/signOut", (req, res) => {
    req.session.userId = null;
    // res.json({ signOut: "succeed" });
    res.redirect("/welcome");
});

app.post("/addVideo", uploader.single("file"), s3.upload, async (req, res) => {
    // console.log("req.body after post addVideo: ", req.file);
    // console.log("req.body: ", req.body);
    const { title, description } = req.body;
    const { filename } = req.file;
    //
    if (req.file) {
        const result = await db.insertVideo(
            filename,
            amazonURL,
            req.session.userId,
            title,
            description
        );

        // console.log("result after db.insertVideo: ", result);
        const date = result.rows[0].created_at;
        const video = result.rows[0].video;
        const id = result.rows[0].id;
        // console.log("date: ", date);
        const dateAsString = date.toString();
        // console.log("dateAsString: ", dateAsString);
        const shortDate = dateAsString.slice(0, 21);
        console.log("shortDate: ", shortDate);
        const newVideo = {
            id: id,
            video: video,
            sender_id: req.session.userId,
            title: title,
            description: description,
            created_at: shortDate
        };
        console.log("newVideo: ", newVideo);
        res.json(newVideo);

        // .catch(err => {
        //     console.log("error in insertURL: ", err);
        // });
    }
});
app.post("/addImage", uploader.single("file"), s3.upload, async (req, res) => {
    const { description, receiverId } = req.body;
    console.log("receiverId after addImage: ", receiverId);
    const { filename } = req.file;
    //
    if (req.file) {
        const result = await db.insertImage(
            filename,
            amazonURL,
            req.session.userId,
            description,
            receiverId
        );

        // console.log("result after db.insertImage: ", result);
        const date = result.rows[0].created_at;
        const image = result.rows[0].image;
        const id = result.rows[0].id;
        // const description = result.rows[0].description;
        console.log("image: ", image);
        const dateAsString = date.toString();
        // console.log("dateAsString: ", dateAsString);
        const shortDate = dateAsString.slice(0, 21);
        // console.log("shortDate: ", shortDate);
        const newImage = {
            id: id,
            image: image,
            sender_id: req.session.userId,
            description: description,
            created_at: shortDate,
            receiver_id: receiverId
        };
        console.log("newImage: ", newImage);
        res.json(newImage);

        // .catch(err => {
        //     console.log("error in insertURL: ", err);
        // });
    }
});

app.get("/receiveImages", async (req, res) => {
    const data = await db.getLastImages();
    // console.log("data.rows after db.getLastImages: ", data.rows);
    data.rows.forEach(x => {
        let date = x.created_at;
        // console.log("date: ", date);
        let dateAsString = date.toString();
        // console.log("dateAsString: ", dateAsString);
        let shortDate = dateAsString.slice(0, 21);
        // console.log("shortDate ", shortDate);
        x.created_at = shortDate;
    });
    res.json(data.rows);
});

app.get("/receiveVideos", async (req, res) => {
    const data = await db.getLastVideos();
    // console.log("data.rows after db.getLastVideos: ", data.rows);
    data.rows.forEach(x => {
        let date = x.created_at;
        // console.log("date: ", date);
        let dateAsString = date.toString();
        // console.log("dateAsString: ", dateAsString);
        let shortDate = dateAsString.slice(0, 21);
        // console.log("shortDate ", shortDate);
        x.created_at = shortDate;
    });
    res.json(data.rows);
});

// DONT DELETE THIS
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    }
    res.sendFile(__dirname + "/index.html");
});

// DONT DELETE THIS

server.listen(8080, function() {
    console.log("I'm listening.");
});

//SERVER SIDE SOCKET CODE

const onlineUsers = {};

io.on("connection", function(socket) {
    console.log(`a socket with the id ${socket.id} just connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    onlineUsers[socket.id] = socket.request.session.userId;

    const userIds = Object.values(onlineUsers);

    socket.broadcast.emit("newUserJoined");

    const userId = socket.request.session.userId;
    console.log("userId: ", userId);

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        console.log(`a socket with the id ${socket.id} just disconnected`);
    });

    /* ... */

    //new table for last messaged

    //get getLasrTenChatMessages probably needs to use a JOIN
    //join users and chats...

    db.getLastTenChatMessages().then(data => {
        // console.log("data.rows: ", data.rows.first);
        data.rows.forEach(x => {
            let date = x.created_at;
            // console.log("date: ", date);
            let dateAsString = date.toString();
            // console.log("dateAsString: ", dateAsString);
            let shortDate = dateAsString.slice(0, 21);
            // console.log("shortDate ", shortDate);
            x.created_at = shortDate;
        });
        const reversed = data.rows.reverse();

        io.sockets.emit("chatMessages", reversed);
    });

    db.getLastTenPosts().then(data => {
        // console.log("data.rows after getLastTenPosts: ", data.rows);
        data.rows.forEach(x => {
            let date = x.created_at;
            // console.log("date: ", date);
            let dateAsString = date.toString();
            // console.log("dateAsString: ", dateAsString);
            let shortDate = dateAsString.slice(0, 21);
            // console.log("shortDate ", shortDate);
            x.created_at = shortDate;
        });
        io.sockets.emit("posts", data.rows);
    });

    socket.on("newMessage", async newMsg => {
        try {
            const result = await db.getUserDetails(userId);
            const { first, last, url } = result[0];
            // console.log("first: ", first, "last: ", last, "url: ", url);
            const data = await db.insertNewChatMessage(newMsg, userId);
            const date = data.rows[0].created_at;
            // console.log("date: ", date);
            const dateAsString = date.toString();
            // console.log("dateAsString: ", dateAsString);
            const shortDate = dateAsString.slice(0, 21);
            // console.log("shortDate: ", shortDate);
            const chatMessage = {
                first: first,
                last: last,
                url: url,
                message_text: newMsg,
                created_at: shortDate
            };
            await io.sockets.emit("chatMessage", chatMessage);
        } catch (err) {
            console.log("err after db.getUserDetails: ", err);
        }
    });

    socket.on("newPost", async newMsg => {
        try {
            const result = await db.getUserDetails(userId);
            const { first, last, url } = result[0];
            // console.log("newMsg with receiverId? ", newMsg);
            const msg = newMsg.value;
            const receiverId = newMsg.otherUserId.otherUserId;
            // console.log("msg: ", msg, "receiverId: ", receiverId);
            // console.log("first: ", first, "last: ", last, "url: ", url);
            const data = await db.insertNewPost(msg, userId, receiverId);
            const date = data.rows[0].created_at;
            const dateAsString = date.toString();
            // console.log("dateAsString: ", dateAsString);
            const shortDate = dateAsString.slice(0, 21);
            // console.log("date:", date);
            const post = {
                first: first,
                last: last,
                url: url,
                post_text: msg,
                created_at: shortDate,
                receiver_id: receiverId
            };
            await io.sockets.emit("post", post);
        } catch (err) {
            console.log("err after db.getUserDetails in newPost: ", err);
        }
        //do a db query to look up into about user
        //we want to do a db query to store new chat message into chat table
        //we want to build up a chat message object (that looks like chat messsage)
        //objects we logged in getLasrTenChatMessages
        //when we have done that, we want to wmit our message obj to everyone
    });
});

//command to search for the database: history | grep git
//sudo service postgresql start
//node bundle-server.js
//git push final HEAD:master
