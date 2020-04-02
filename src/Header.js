import React from "react";
// import { ProfilePic } from "./ProfilePic";
import { Link } from "react-router-dom";

export function Header({ signOut }) {
    return (
        <div>
            <div className="concerthub">ConcertHub</div>
            <div id="links">
                <Link id="usersLink" to="/users">
                    search
                </Link>
                <Link id="friendsLink" to="/friends">
                    friends
                </Link>
                <Link id="myProfileLink" to="/">
                    my profile
                </Link>
                <Link id="myChatLink" to="/chat">
                    online concert hall
                </Link>
                <button id="signOut" onClick={signOut}>
                    sign out
                </button>
            </div>
        </div>
    );
}
