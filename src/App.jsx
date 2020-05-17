import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../src/view/components/Navbar/Navbar";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./view/Screen/Home/Home";

class App extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <div style={{ height: "120px" }} />
      </>
    );
  }
}

export default App;
