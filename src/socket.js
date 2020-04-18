import * as io from "socket.io-client";

import { chatMessages, chatMessage, posts, post } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));

        socket.on("posts", msgs => store.dispatch(posts(msgs)));
        socket.on("post", msg => store.dispatch(post(msg)));
    }
};
