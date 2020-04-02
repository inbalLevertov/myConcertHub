import React, { useState, useEffect } from "react";
import axios from "./axioscopy";
import { Link } from "react-router-dom";

export function FindPeople() {
    // let first, last, url, id;
    const [users, setUsers] = useState();
    const [searchUsers, setSearchUsers] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        console.log("useEffect is running");
        // return () => {
        axios
            .get("/users.json")
            .then(({ data }) => {
                console.log("data after get /users.json: ", data.result);
                setUsers(data.result);
                // };
            })
            .catch(err => {
                console.log("err after get /users.json: ", err);
            });
    }, []);

    useEffect(() => {
        console.log("searchUsers is running");
        // if (searchUsers) {
        // }
        // let searched = setUsers(e.target.value);
        axios
            .post("/searching", { searchUsers })
            .then(({ data }) => {
                console.log("data after post /searching: ", data.result);
                setData(data.result);
            })
            .catch(err => {
                console.log("err after post /searching: ", err);
            });
    }, [searchUsers]);

    return (
        <div>
            <div className="findPeopleContainer">
                <div id="findInnerContainer">
                    Find other music lovers
                    <input
                        onChange={e => setSearchUsers(e.target.value)}
                        placeholder="enter name here"
                    />
                </div>
                {data &&
                    data.map(user => (
                        <div className="chosenList" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <img
                                    className="imageInList"
                                    src={user.url || "/default.jpg"}
                                    alt={`${user.first} ${user.last}`}
                                />
                                {user.first} {user.last}
                            </Link>
                        </div>
                    ))}
                {!data ||
                    (!data.length &&
                        (users &&
                            users.map(user => (
                                <div className="chosenList" key={user.id}>
                                    <img
                                        className="imageInList"
                                        src={user.url || "/default.jpg"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <Link to={`/user/${user.id}`}>
                                        {user.first} {user.last}
                                    </Link>
                                </div>
                            ))))}
            </div>
        </div>
    );
}
