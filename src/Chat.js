import React, { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import { useSelector, useDispatch } from "react-redux";
import { video, videos } from "./actions";

export function Chat() {
    const dispatch = useDispatch();
    const chatMessages = useSelector(state => state && state.chatMessages);
    const oldVideos = useSelector(state => state && state.videos);
    const newVideo = useSelector(state => state && state.video);
    const [searchVideos, setSearchVideos] = useState({});
    const [error, setError] = useState();

    const elementRef = useRef();

    useEffect(() => {
        elementRef.current.scrollTop =
            elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, []);

    useEffect(() => {
        elementRef.current.scrollTop =
            elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, [chatMessages]);

    useEffect(() => {
        dispatch(videos());
    }, []);

    useEffect(() => {
        dispatch(videos());
    }, [newVideo]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("e.target.value: ", e.target.value);
            socket.emit("newMessage", e.target.value);
            // chatMessage;
            e.target.value = "";
        }
    };

    const useStatefulFields = e => {
        setSearchVideos({
            ...searchVideos,
            [e.target.name]: e.target.value
        });
    };

    const handleClick = e => {
        e.preventDefault();
        if (
            searchVideos.file.type != "video/mp4" &&
            searchVideos.file.type != "video/quicktime"
        ) {
            console.log("error, the file must be a video file");
            setError({ error: true });
            return;
        } else {
            var formData = new FormData();
            formData.append("file", searchVideos.file);
            formData.append("title", searchVideos.title);
            formData.append("description", searchVideos.description);
            dispatch(video(formData));
        }
    };

    return (
        <div id="chat-out">
            <div id="upload-video">
                <h1>Upload your video here:</h1>
                <form>
                    <input
                        type="text"
                        name="title"
                        placeholder="title"
                        onChange={e => useStatefulFields(e)}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="description"
                        onChange={e => useStatefulFields(e)}
                    />
                    <input
                        onChange={e =>
                            setSearchVideos({
                                ...searchVideos,
                                file: e.target.files[0]
                            })
                        }
                        placeholder="choose video"
                        id="file"
                        className="inputfile"
                        type="file"
                        name="file"
                    />
                    <button onClick={handleClick}>submit</button>
                </form>
                {error && (
                    <div id="video-error">please upload a video file</div>
                )}
            </div>
            <div id="videoAndChat">
                <h1>Video Library</h1>
                <h1>Chat Room</h1>
            </div>

            <div id="chat-in">
                <div className="chat">
                    <div className="chat-container" ref={elementRef}>
                        {chatMessages &&
                            chatMessages.map(user => (
                                <div className="chatMessages" key={user.date}>
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

                                        <p className="msgInChat">
                                            {user.message_text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <textarea
                        placeholder="Add your message here"
                        onKeyDown={keyCheck}
                    />
                </div>
                <div id="ConcertHallsmallContainer">
                    {oldVideos &&
                        oldVideos.map(user => (
                            <div className="videos" key={user.date}>
                                <div className="rightSideVideo">
                                    <div className="imgNameDate">
                                        <img
                                            className="imagesInVideo"
                                            src={user.url || "/default.jpg"}
                                            alt={`${user.first} ${user.last}`}
                                        />
                                        <div className="nameAndDate">
                                            <p className="nameInVideo">{`${user.first} ${user.last}`}</p>
                                            <p className="dateInVideo">
                                                {user.created_at}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="video-title">{user.title}</p>
                                    <p className="video-description">
                                        {user.description}
                                    </p>
                                    <video
                                        className="videoInLibrary"
                                        id="samp"
                                        controls
                                        src={user.video}
                                        type="video/mp4"
                                    ></video>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
