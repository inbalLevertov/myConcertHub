import React from "react";
import { ProfilePic } from "./ProfilePic";
import { BioEditor } from "./BioEditor";
import { Wall } from "./Wall";

export function Profile({ id, url, first, last, clickHandler, setBio, bio }) {
    console.log("id on profile: ", id);
    const otherUserId = { otherUserId: id };
    return (
        <div id="prof">
            <div id="musicLover">
                Hello music lover, <br></br> tell us something about yourself
                and your musical taste by adding profile pic and bio!
            </div>
            <div className="profile-container">
                <div id="ppAndName">
                    <ProfilePic
                        first={first}
                        last={last}
                        url={url}
                        clickHandler={clickHandler}
                    />
                    <p id="fullName">
                        {first} {last}
                    </p>
                </div>
                <Wall otherUserId={otherUserId} firstName={first} />
                <BioEditor
                    first={first}
                    last={last}
                    setBio={setBio}
                    bio={bio}
                />
            </div>
        </div>
    );
}
