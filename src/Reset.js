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
        // console.log("handleChange running");
        // console.log("e.target.value: ", e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            // () => console.log("this.state: ", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log("handleSubmit running, this.state: ", this.state);
        let userDetails = this.state;
        axios
            .post("/password/reset/start", userDetails)
            .then(resp => {
                console.log("resp.data: ", resp.data);
                // if (resp.data.email === false) {
                //     console.log("email dont exist in data");
                //     this.setState({
                //         wrongEmail: true
                //     });
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

                // } else if (resp.data.errinGetpass === true) {
                //     console.log("no password or email given");
                //     this.setState({
                //         noEmailOrPass: true
                //     });
                // } else {
                //     location.replace("/");
                // }
            })
            .catch(function(err) {
                console.log("err in POST /password/reset/start: ", err);
            });
    }

    submitNewPass(e) {
        e.preventDefault();
        console.log("submitNewPass running, this state: ", this.state);
        // console.log("handleSubmit running, this.state: ", this.state);
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

// render() {
//     return (
//         <div>
//             <h1 className="register">Log in</h1>
//             <form>
//                 <input
//                     onChange={this.handleChange}
//                     name="email"
//                     type="text"
//                     placeholder="email"
//                 />
//                 <input
//                     onChange={this.handleChange}
//                     name="password"
//                     type="password"
//                     placeholder="password"
//                 />
//                 <button onClick={this.handleSubmit}>log in</button>
//                 {this.state.wrongPass && (
//                     <p>
//                         wrong password or email address, please try again{" "}
//                     </p>
//                 )}
//                 {this.state.noEmailOrPass && (
//                     <p>please fill out your email address and password </p>
//                 )}
//                 <Link id="linkLogin" to="/">
//                     Register
//                 </Link>
//             </form>
//         </div>
//     );
// }
