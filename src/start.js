import React from "react";
import ReactDOM from "react-dom";
// import axios from "./axioscopy";
import { Welcome } from "./Welcome";
import { App } from "./App";
import { init } from "./socket";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    init(store);
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));
