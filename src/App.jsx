import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../src/view/components/Navbar/Navbar";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./view/Screen/Home/Home";
import AuthScreen from "./view/Screen/Auth/AuthScreen";
import ProductDetails from "./view/Screen/ProductDetails/ProductDetails";

class App extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/auth" component={AuthScreen} />
          <Route exact path="/concerts/:concertId" component={ProductDetails} />
        </Switch>
        <div style={{ height: "120px" }} />
      </>
    );
  }
}

export default App;
