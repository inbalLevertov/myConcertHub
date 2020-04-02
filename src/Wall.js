import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { posts, post, image, images } from "./actions";
// import axios from "./axioscopy";

export function Wall({ otherUserId }) {
    const dispatch = useDispatch();
    // const oldImages = useSelector(state => state && state.images);
    const newImage = useSelector(state => state && state.image);
    const [searchImages, setSearchImages] = useState({});

    const oldPosts = useSelector(
        // state => state.friendsWannabes
        state =>
            state.posts &&
            state.posts.filter(
                post => post.receiver_id == otherUserId.otherUserId
            )
    );

    const oldImages = useSelector(
        state =>
            state &&
            state.images &&
            state.images.filter(
                image => image.receiver_id == otherUserId.otherUserId
            )
    );

    useEffect(() => {}, []);

    useEffect(() => {}, [oldPosts]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();

            console.log("otherUserId: ", otherUserId);
            socket.emit("newPost", {
                value: e.target.value,
                otherUserId
            });
            e.target.value = "";
        }
    };

    useEffect(() => {
        dispatch(images());
    }, []);

    useEffect(() => {
        dispatch(images());
    }, [newImage]);

    const handleClick = e => {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", searchImages.file);
        formData.append("description", searchImages.description);
        formData.append("receiverId", otherUserId.otherUserId);
        dispatch(image(formData));
    };

    const useStatefulFields = e => {
        setSearchImages({
            ...searchImages,
            [e.target.name]: e.target.value
        });
        // console.log("searchImages after useStatefulFields: ", searchImages);
    };

    return (
        <div className="wall">
            <div className="wall-container">
                <textarea
                    placeholder="What's on your mind?"
                    onKeyDown={keyCheck}
                    id="textareaWall"
                />
                <div id="imgDescription">
                    <input
                        onChange={e =>
                            setSearchImages({
                                ...searchImages,
                                file: e.target.files[0]
                            })
                        }
                        placeholder="choose image"
                        id="fileInWall"
                        className="inputfile"
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <input
                        id="descriptionInWall"
                        type="text"
                        name="description"
                        placeholder="description"
                        onChange={e => useStatefulFields(e)}
                    />
                    <button id="submitInWall" onClick={handleClick}>
                        submit
                    </button>
                </div>

                {oldPosts &&
                    oldPosts.map(user => (
                        <div className="everypost" key={user.msgId}>
                            <div className="nameDateImgWall">
                                <img
                                    className="imagesInChat"
                                    src={user.url || "/default.jpg"}
                                    alt={`${user.first} ${user.last}`}
                                />
                                <div className="nameDateWall">
                                    <p className="nameInChat">{`${user.first} ${user.last}`}</p>
                                    <p className="dateInChat">
                                        {user.created_at}
                                    </p>
                                </div>
                            </div>
                            <p className="messageInChat">{user.post_text}</p>
                        </div>
                    ))}
                <div id="postsContainer">
                    {oldImages &&
                        oldImages.map(user => (
                            <div className="everypost">
                                <div
                                    className="nameDateImgWall"
                                    key={user.date}
                                >
                                    <img
                                        className="imagesInChat"
                                        src={user.url || "/default.jpg"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <div className="rightSide">
                                        <p className="nameInChat">{`${user.first} ${user.last}`}</p>
                                        <p className="dateInChat">
                                            {user.created_at}
                                        </p>
                                    </div>
                                </div>

                                <img className="imageInWall" src={user.image} />
                                <p className="wallImage-description">
                                    {user.description}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
