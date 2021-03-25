import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import App from "../components/App";

const App = () => {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/">
                            <App />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }

export default App;
