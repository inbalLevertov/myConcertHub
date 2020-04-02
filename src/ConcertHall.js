import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";

export function ConcertHall() {
    return (
        <div id="ConcertHallsmallContainer">
            <h1>library</h1>
            <p>
                here will stand the videos like in imageboard where people can
                choose and add comments
            </p>
        </div>
    );
}
