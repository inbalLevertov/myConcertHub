import React from "react";
import axios from "./axioscopy";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // buttonAdd: true,
            bioAndEdit: true
        };
        this.showArea = this.showArea.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveBio = this.saveBio.bind(this);
    }
    // componentDidMount() {
    //     axios.get("/user").then(({ data }) => {
    //         this.setState(data.details);
    //         console.log("this.state after get /user: ", this.state);
    //     });
    // }
    showArea() {
        this.setState({
            textAreaAppear: true
            // buttonAdd: false
        });
    }

    handleChange(e) {
        console.log("handleChange is running");
        this.setState({ bio: e.target.value });
        console.log("this.state.bio: ", this.state.bio);
    }

    saveBio() {
        // const newBio = this.state.bio;
        axios.post("/bio", this.state).then(resp => {
            console.log("resp after post /bio; ", resp.data);
            this.setState(resp.data);
            console.log("this.state after saveBio: ", this.state);
        });
    }

    render() {
        return (
            <div>
                {this.props.bio && this.state.bioAndEdit && (
                    <div>
                        <div className="textareaIfBioExists">
                            <button
                                onClick={() => {
                                    this.showArea();
                                    this.setState({
                                        bioAndEdit: false
                                    });
                                }}
                                id="editBio"
                            >
                                edit
                            </button>
                            <p className="bio"> {this.props.bio}</p>
                        </div>
                    </div>
                )}

                {this.state.textAreaAppear && (
                    <div>
                        <div className="textareaContainer">
                            <textarea
                                onChange={this.handleChange}
                                id="textarea"
                                defaultValue={this.props.bio}
                            ></textarea>
                            <button
                                id="saveBtnBioEditor"
                                onClick={() => {
                                    this.saveBio();
                                    this.props.setBio(this.state.bio);
                                    this.setState({ bioAndEdit: true });
                                    this.setState({ textAreaAppear: false });
                                    console.log(
                                        "this.state.textAreaAppear: ",
                                        this.state.textAreaAppear
                                    );
                                    console.log(
                                        "this.props.bio: ",
                                        this.props.bio
                                    );
                                }}
                            >
                                save
                            </button>
                        </div>
                    </div>
                )}

                {!this.props.bio && this.state.bioAndEdit && (
                    <div>
                        <div className="bioContainer">
                            <p>
                                hallo {this.props.first}, would you like to add
                                a bio?
                            </p>
                            <button
                                onClick={() => {
                                    this.showArea();
                                    this.setState({
                                        bioAndEdit: false
                                    });
                                }}
                                id="addBio"
                            >
                                Add bio
                            </button>
                            {this.state.textAreaAppear && (
                                <div>
                                    <textarea
                                        onChange={this.handleChange}
                                        id="textarea"
                                    ></textarea>
                                    <button
                                        onClick={() => {
                                            this.saveBio();
                                            this.props.setBio(this.state.bio);
                                            this.setState({ bioExist: true });
                                            this.setState({
                                                textAreaAppear: false
                                            });
                                        }}
                                    >
                                        save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
