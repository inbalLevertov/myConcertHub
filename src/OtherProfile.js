import React from "react";
import axios from "./axioscopy";
import { FriendButton } from "./FriendButton";
import { Wall } from "./Wall";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("this.props.match: ", this.props.match);
        axios
            .get(`/user/${this.props.match.params.id}.json`)
            .then(({ data }) => {
                console.log("data from get /user: ", data);
                if (data.redirecting === true) {
                    // console.log("redirecting to /");
                    this.props.history.push("/");
                    // } else if (data.result[0].accepted == true) {
                    //     let result = data.result[0];
                    // this.setState({
                    //     id: result.id,
                    //     first: result.first,
                    //     last: result.last,
                    //     url: result.url,
                    //     bio: result.bio,
                    //     wall: true
                    // });
                } else {
                    let result = data.result[0];
                    this.setState({
                        id: result.id,
                        first: result.first,
                        last: result.last,
                        url: result.url,
                        bio: result.bio
                    });
                }
            });
    }
    render() {
        return (
            <div>
                <div className="otherUser">
                    <div className="fullNameOther">
                        <p className="firstOther">{this.state.first}</p>
                        <p className="lastOther">{this.state.last}</p>
                    </div>
                    <img
                        className="ppBig"
                        src={this.state.url || "/default.jpg"}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                    <p className="otherBio">{this.state.bio}</p>

                    <FriendButton otherUserId={this.props.match.params.id} />
                </div>
                {this.state.wall && (
                    <Wall otherUserId={this.props.match.params.id} />
                )}
            </div>
        );
    }
}

//otherUserId={this.props.match.params.id}

//                    <FriendButton otherUserId={this.props.match.params.id} />

// <Wall
//     handleClick={this.props.handleClick}
//     handleChange={this.props.handleChange}
//     handleClose={this.props.handleClose}
//     url={this.props.url}
//     first={this.props.first}
//     last={this.props.last}
// />
