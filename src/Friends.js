import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendsRequest,
    unfriend
} from "./actions";

export function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        // state => state.friendsWannabes
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => friend.accepted == true)
    );

    const wannabes = useSelector(
        // state => state.friendsWannabes
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => friend.accepted == false)
    );

    console.log("these are the wannabes: ", wannabes);

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!receiveFriendsWannabes) {
        return null;
    }

    return (
        <div>
            <div id="wannabesContainer">
                <div className="wannabes">
                    <p className="titles">Friend Requests: </p>
                    <div className="wannabesList">
                        {!wannabes ||
                            (!wannabes.length && (
                                <p id="try">
                                    You have no friend requests at the moment{" "}
                                </p>
                            ))}
                        {wannabes &&
                            wannabes.map(user => (
                                <div className="chosenList" key={user.id}>
                                    <img
                                        className="imageInList"
                                        src={user.url || "/default.jpg"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <Link to={`/user/${user.id}`}>
                                        {user.first} {user.last}
                                    </Link>
                                    <button
                                        className="friendshipBtn"
                                        onClick={() =>
                                            dispatch(
                                                acceptFriendsRequest(user.id)
                                            )
                                        }
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div id="friendsContainer">
                <div className="confirmedFriends">
                    <p className="titles">My friends: </p>
                    <div className="friendsList">
                        {!friends ||
                            (!friends.length && (
                                <p id="try">
                                    you have no friend at the moment{" "}
                                </p>
                            ))}
                        {friends &&
                            friends.map(user => (
                                <div className="chosenList" key={user.id}>
                                    <img
                                        className="imageInList"
                                        src={user.url || "/default.jpg"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <Link to={`/user/${user.id}`}>
                                        {user.first} {user.last}
                                    </Link>
                                    <button
                                        className="friendshipBtn"
                                        onClick={() =>
                                            dispatch(unfriend(user.id))
                                        }
                                    >
                                        End Friendship
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
