import axios from "./axioscopy";

//
export async function receiveFriendsWannabes() {
    const { data } = await axios.get(`/friends-wannabes`);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsWannabes: data
    };
}
export async function acceptFriendsRequest(otherUserId) {
    await axios.post("/accept-friend-request", {
        otherUserId: otherUserId
    });

    return {
        type: "ACCEPT_FRIEND",
        id: otherUserId
    };
}
//
export async function unfriend(otherUserId) {
    await axios.post("/end-friendship", { otherUserId });
    console.log("data after get /accept-friend-request: ", otherUserId);
    return {
        type: "DELETE_FRIEND",
        id: otherUserId
    };
}

export function chatMessages(msgs) {
    return {
        type: "RECEIVE_MESSAGES",
        chatMessages: msgs
    };
}

export function chatMessage(msg) {
    return {
        type: "ADD_MESSAGE",
        chatMessage: msg
    };
}
export function posts(msgs) {
    console.log("msgs after RECEIVE_POSTS: ", msgs);
    return {
        type: "RECEIVE_POSTS",
        posts: msgs
    };
}

export function post(msg) {
    console.log("msg: ", msg);
    return {
        type: "ADD_POST",
        post: msg
    };
}

export async function video(video) {
    await axios.post("/addVideo", video);
    return {
        type: "ADD_VIDEO",
        video: video
    };
}
export async function videos() {
    const data = await axios.get("/receiveVideos");
    return {
        type: "RECEIVE_VIDEO",
        videos: data.data
    };
}
export async function image(image) {
    await axios.post("/addImage", image);
    return {
        type: "ADD_IMAGE",
        image: image
    };
}
export async function images() {
    const data = await axios.get("/receiveImages");
    return {
        type: "RECEIVE_IMAGE",
        images: data.data
    };
}
