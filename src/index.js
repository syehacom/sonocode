import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import firebase from "./utils/Firebase";

if (process.env.NODE_ENV === "production") {
    firebase.analytics();
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
