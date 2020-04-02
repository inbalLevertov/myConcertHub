import React, { useEffect, useState } from "react";
import axios from "./axioscopy";
import { Wall } from "./Wall";

export function FriendButton(otherUserId) {
    const [buttonText, setButtonText] = useState("Make Friend Request");
    const [wall, setWall] = useState();
    useEffect(() => {
        console.log("useEffect  in FriendButton is running");
        console.log("otherUserId: ", otherUserId);
        // return () => {
        axios
            .get(`/initial-friendship-status/${otherUserId.otherUserId}`)
            .then(({ data }) => {
                console.log("DATA after initial friendship status: ", data);
                setButtonText(data.buttonText);
                setWall(data.wall);
            })
            .catch(err => {
                console.log("err after get /FriendButtonMount: ", err);
                // setButtonText(err.ButtonText);
            });
    }, []);

    useEffect(() => {
        console.log("useEffect  in FriendButton is running");
        console.log("otherUserId: ", otherUserId);
        // return () => {
        axios
            .get(`/initial-friendship-status/${otherUserId.otherUserId}`)
            .then(({ data }) => {
                console.log("DATA after initial friendship status: ", data);
                setButtonText(data.buttonText);
                setWall(data.wall);
            })
            .catch(err => {
                console.log("err after get /FriendButtonMount: ", err);
                // setButtonText(err.ButtonText);
            });
    }, [buttonText]);

    const handleClick = () => {
        console.log("buttonText testing: ", buttonText);
        if (buttonText == "Make Friend Request") {
            axios
                .post("/make-friend-request", otherUserId)
                .then(({ data }) => {
                    console.log(
                        "data after post /make-friend-request: ",
                        data.result
                    );
                    setButtonText("Cancel Friend Request");
                })
                .catch(err => {
                    console.log("err after post /make-friend-request: ", err);
                });
        } else if (buttonText == "Cancel Friend Request") {
            axios
                .post("/cancel-friend-request", otherUserId)
                .then(({ data }) => {
                    console.log(
                        "data after post /cancel-friend-request: ",
                        data.result
                    );
                    setButtonText("Make Friend Request");
                })
                .catch(err => {
                    console.log("err after post /make-friend-request: ", err);
                });
        } else if (buttonText == "Accept Friend Request") {
            axios
                .post("/accept-friend-request", otherUserId)
                .then(({ data }) => {
                    console.log(
                        "data after post /cancel-friend-request: ",
                        data.result
                    );
                    setButtonText("End Friendship");
                })
                .catch(err => {
                    console.log("err after post /make-friend-request: ", err);
                });
        } else if (buttonText == "End Friendship") {
            axios
                .post("/end-friendship", otherUserId)
                .then(({ data }) => {
                    console.log(
                        "data after post /end-friendship: ",
                        data.result
                    );
                    setButtonText("Make Friend Request");
                })
                .catch(err => {
                    console.log("err after post /end-friendship: ", err);
                });
        }
    };

    return (
        <div className="friendButton">
            <button id="friendReqBtn" onClick={handleClick}>
                {buttonText}
            </button>
            {wall && <Wall otherUserId={otherUserId} />}
        </div>
    );
}
