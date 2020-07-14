import React from "react";
import "./App.css";
import Cookie from "universal-cookie";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../src/view/components/Navbar/Navbar";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./view/Screen/Home/Home";
import AuthScreen from "./view/Screen/Auth/AuthScreen";
import ProductDetails from "./view/Screen/ProductDetails/ProductDetails";
import AdminDashboard from "./view/Screen/Admin/AdminDashboard";
import { userKeepLogin, cookieChecker } from "./redux/actions";
import { connect } from "react-redux";
import UserProfile from "./view/Screen/User/UserProfile";

const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    let cookieResult = cookieObj.get("authData");
    if (cookieResult) {
      this.props.keepLogin(cookieResult);
    } else {
      this.props.cookieChecker();
    }
  }
  render() {
    if (this.props.user.cookieChecked) {
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreen} />
            <Route exact path="/profile" component={UserProfile} />
            <Route exact path="/admin/dashboard" component={AdminDashboard} />
            <Route
              exact
              path="/concerts/:concertId"
              component={ProductDetails}
            />
          </Switch>
          <div style={{ height: "120px" }} />
        </>
      );
    } else {
      return <div>Loading....</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
