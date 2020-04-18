import React from "react";
import axios from "./axioscopy";
import { Link } from "react-router-dom";

export class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // console.log("handleChange running");
        // console.log("e.target.value: ", e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let userDetails = this.state;
        axios
            .post("/login", userDetails)
            .then(resp => {
                if (resp.data.passwordMatch === false) {
                    console.log("password dont match");
                    this.setState({
                        wrongPass: true
                    });
                } else if (resp.data.errinGetpass === true) {
                    console.log("no password or email given");
                    this.setState({
                        noEmailOrPass: true
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch(function(err) {
                console.log("err in POST /login: ", err);
            });
    }

    render() {
        return (
            <div>
                <h1 className="register">Log in</h1>
                <form>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button onClick={this.handleSubmit}>log in</button>
                    {this.state.wrongPass && (
                        <p>
                            wrong password or email address, please try again{" "}
                        </p>
                    )}
                    {this.state.noEmailOrPass && (
                        <p>please fill out your email address and password </p>
                    )}
                    <Link id="linkLogin" to="/">
                        Register
                    </Link>
                    <Link id="linkReset" to="/reset">
                        Forgot password?
                    </Link>
                </form>
            </div>
        );
    }
}
