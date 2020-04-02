import React from "react";
import { Registration } from "./Registration";
import { HashRouter, Route } from "react-router-dom";
import { Login } from "./login";
import { ResetPassword } from "./Reset";

export function Welcome() {
    return (
        <div id="welcome-container">
            <div className="concerthubWelcome">welcome to ConcertHub!</div>
            <img className="logo" src="/logo5.png" alt="logo" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}

// <img src="/piano.png" id="piano" />
