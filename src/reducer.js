// export default function(state = {}, action) {
//     return state;
// }

export default function(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
    }
    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(friend => {
                if (friend.id == action.id) {
                    return { ...friend, accepted: true };
                } else {
                    return friend;
                }
            })
        };
    }
    if (action.type == "DELETE_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                friend => friend.id != action.id
            )
        };
    }
    if (action.type == "RECEIVE_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type == "ADD_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage]
        };
    }
    if (action.type == "RECEIVE_POSTS") {
        state = {
            ...state,
            posts: action.posts
        };
    }
    if (action.type == "ADD_POST") {
        state = {
            ...state,
            posts: [action.post, ...state.posts]
        };
    }

    if (action.type == "ADD_VIDEO") {
        state = {
            ...state,
            video: action.video
        };
    }
    if (action.type == "RECEIVE_VIDEO") {
        state = {
            ...state,
            videos: action.videos
        };
    }
    if (action.type == "ADD_IMAGE") {
        state = {
            ...state,
            image: action.image
        };
    }
    if (action.type == "RECEIVE_IMAGE") {
        state = {
            ...state,
            images: action.images
        };
    }
    return state;
}
