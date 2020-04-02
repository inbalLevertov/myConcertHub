import * as io from "socket.io-client";

// import { chatMessages, chatMessage } from "./actions";
//
// export let socket;
//
// export const init = store => {
//     if (!socket) {
//         socket = io.connect();
//
//         socket.on("messageBack", myMessage => {
//             console.log("myMessage on the client side: ", myMessage);
//         });
//         // store.dispatch(chatMessages(msgs)));
//
//         socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
//
//         socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));
//     }
// };

import { chatMessages, chatMessage, posts, post } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));

        socket.on("posts", msgs => store.dispatch(posts(msgs)));
        socket.on("post", msg => store.dispatch(post(msg)));

        // socket.on("videos", msgs => store.dispatch(posts(msgs)));
        // socket.on("video", msg => store.dispatch(post(msg)));
    }
};
