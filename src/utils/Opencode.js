import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from "../components/Home";

const Opencode = () => {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }

export default Opencode;
