import React from "react";
import axios from "./axioscopy";

export class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitNewPass = this.submitNewPass.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let userDetails = this.state;
        axios
            .post("/password/reset/start", userDetails)
            .then(resp => {
                if (resp.data.errInDbCompareEmail === true) {
                    console.log("email dont exist in data. catch in index.js");
                    this.setState({
                        wrongEmail: true
                    });
                }

                if (resp.data.codeSent === true) {
                    console.log("code sent successfully");
                    this.setState({
                        currentDisplay: 2
                    });
                }
            })
            .catch(function(err) {
                console.log("err in POST /password/reset/start: ", err);
            });
    }

    submitNewPass(e) {
        e.preventDefault();
        let userDetails = this.state;
        axios.post("/password/reset/verify", userDetails).then(resp => {
            console.log("resp.data: ", resp.data);
            location.replace("/");
        });
    }

    render() {
        return (
            <div>
                {this.state.currentDisplay == 1 && (
                    <div>
                        <form>
                            <p>
                                please enter the email address with which you
                                registered
                            </p>
                            <input
                                onChange={this.handleChange}
                                name="email"
                                type="text"
                                placeholder="email"
                            />
                            <button onClick={this.handleSubmit}>submit</button>
                        </form>
                        {this.state.wrongEmail && (
                            <p>
                                this email address is not registered, please try
                                again{" "}
                            </p>
                        )}
                    </div>
                )}
                {this.state.currentDisplay == 2 && (
                    <div>
                        <form>
                            <p>please enter the code you received</p>

                            <input
                                onChange={this.handleChange}
                                name="code"
                                type="text"
                                placeholder="code"
                            />
                            <p>please enter a new password</p>
                            <input
                                onChange={this.handleChange}
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                            <button onClick={this.submitNewPass}>submit</button>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
