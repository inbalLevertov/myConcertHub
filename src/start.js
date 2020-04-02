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

// import * as io from "socket.io-client";
// const socket = io.connect();
// socket.on("hello", data => {
//     console.log("data: ", data);
//     socket.emit("funkyChicken", ["allspice", "cute", "bunnies"]);
// });
// socket.on("newConnection", data => {
//     console.log("data: ", data);
//     // socket.emit("funkyChicken", ["allspice", "cute", "bunnies"]);
// });

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
///
// <Provider store={store}>
//     <App />
// </Provider>
//
//
//
// ////
// ReactDOM.render(
//     location.pathname == "/welcome" ? (
//         <Welcome />
//     ) : (
//         init(store);
//         (
//             <Provider store={store}>
//                 <App />
//             </Provider>
//         )
//     ),
//     document.querySelector("main")
// );

// ReactDOM.render is called only ONCE in the application

//function to create a component
// function HelloWorld() {
//     //every component must return ONE div (that can have many children)
//     return <div>Hello, World!</div>;
// }
//the main difference between class and function components: class components CAN have state
//and function components CANNOT!
//class syntax to create a component:
// class HelloWorld extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             name: "inbal"
//             //defalut values are optionall, not a must:
//             // images: [],
//             // id: null
//         };
//         //this is how we solve error: cannot read property 'setState' of undefined
//         this.handleClick = this.handleClick.bind(this);
//         //anoter way in in the p tag itself: <p onClick={() => this.handleClick()}>Im a class component </p>
//     }
//     componentDidMount() {
//         //lifecycle method. will run once the component has mounted on screen
//         //this is a good place to do axios request to fetch info from the server
//         // axios.get('/user').then({data}) => {});
//         setTimeout(() => {
//             //we have received response from the server with data in it and we want to store it in state!
//             let name = "allspice";
//             let family = "Levertov";
//             this.setState({
//                 name, // ES6 version to name: name
//                 family
//             }); //this is how we update state in the component. setState is a function that takes an object as an arguent
//         }, 2000);
//     } //componentDidMount closes
//
//     handleClick() {
//         console.log("handleClick running");
//         this.setState({
//             name: "Naaman"
//         });
//     }
//
//     render() {
//         return (
//             <div>
//                 <p className="headlines">Hello, World! </p>
//                 <p onClick={this.handleClick}>Im a class component </p>
//                 <p>my name is {this.state.name}</p>
//                 <p>my family name is {this.state.family}</p>
//                 <User name={this.state.name} />
//             </div>
//         );
//     }
// }
// //the argument we pass to User is an object that will have a property named name, beacause we
// // stated in when rendering in the Hello world component
// function User(props) {
//     console.log("props:", props);
//     return <h1>{props.name}</h1>;
// }

//ReactDOM can render only one component at a time
// ReactDOM.render(<HelloWorld />, document.querySelector("main"));
