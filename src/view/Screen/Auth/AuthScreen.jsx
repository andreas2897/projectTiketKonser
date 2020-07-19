import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

// actions
import { registerHandler, loginHandler } from "../../../redux/actions";

class AuthScreen extends React.Component {
  state = {
    activePage: "register",
    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    },
    registerForm: {
      username: "",
      email: "",
      password: "",
      showPassword: false,
    },
    modalOpen: false,
    forgotPass: {
      email: "",
    },
  };

  componentDidUpdate() {
    if (this.props.user.id) {
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });

    console.log(e.target);

    // this.setState({ loginForm: {
    //   ...this.state.loginForm,
    //   [fieldYangDiganti]: value
    // }})
  };

  registerBtnHandler = () => {
    const { username, password, email } = this.state.registerForm;
    let newUser = {
      username,
      password,
      email,
    };

    this.props.onRegister(newUser);
  };

  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let newUser = {
      username,
      password,
    };

    this.props.onLogin(newUser);
  };

  checkboxHandler = (e, form) => {
    const { checked } = e.target;

    console.log(checked);

    this.setState({
      [form]: {
        ...this.state[form],
        showPassword: checked,
      },
    });
  };

  renderAuthComponent = () => {
    const { activePage } = this.state;
    if (activePage == "register") {
      return (
        <div className="mt-5">
          <h3>Register</h3>
          <p className="mt-4">You will get the best entertainment</p>
          <TextField
            value={this.state.registerForm.username}
            onChange={(e) => this.inputHandler(e, "username", "registerForm")}
            placeholder="Username"
            className="mt-5"
          />
          <TextField
            value={this.state.registerForm.email}
            onChange={(e) => this.inputHandler(e, "email", "registerForm")}
            placeholder="Email"
            className="mt-2"
          />
          <TextField
            value={this.state.registerForm.password}
            onChange={(e) => this.inputHandler(e, "password", "registerForm")}
            placeholder="Password"
            className="mt-2"
            type={this.state.registerForm.showPassword ? "text" : "password"}
          />
          <input
            type="checkbox"
            onChange={(e) => this.checkboxHandler(e, "registerForm")}
            className="mt-3"
            name="showPasswordRegister"
          />{" "}
          Show Password
          <div className="d-flex justify-content-center">
            <ButtonUI
              type="contained"
              onClick={this.registerBtnHandler}
              className="mt-4"
            >
              Register
            </ButtonUI>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-5">
          <h3>Log In</h3>
          <p className="mt-4">
            Welcome back.
            <br /> Please, login to your account
          </p>
          <TextField
            value={this.state.loginForm.username}
            onChange={(e) => this.inputHandler(e, "username", "loginForm")}
            placeholder="Username"
            className="mt-5"
          />
          <TextField
            value={this.state.loginForm.password}
            onChange={(e) => this.inputHandler(e, "password", "loginForm")}
            placeholder="Password"
            className="mt-2"
            type={this.state.loginForm.showPassword ? "text" : "password"}
          />
          <input
            type="checkbox"
            onChange={(e) => this.checkboxHandler(e, "loginForm")}
            className="mt-3"
            name="showPasswordLogin"
          />{" "}
          Show Password
          <div className="d-flex justify-content-center">
            <ButtonUI onClick={this.toggleModal} type="textual">
              Forgot Password
            </ButtonUI>
          </div>
          <div className="d-flex justify-content-center">
            <ButtonUI
              onClick={this.loginBtnHandler}
              type="contained"
              className="mt-4"
            >
              Login
            </ButtonUI>
          </div>
        </div>
      );
    }
  };

  sendEmail = () => {
    console.log(this.state.forgotPass.email);
    Axios.get(`${API_URL}/users/email/${this.state.forgotPass.email}`)
      .then((res) => {
        console.log(res.data);
        swal("Success", "Check Email", "success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.props.user.id > 0) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-5">
            <div className="d-flex flex-row">
              <ButtonUI
                className={`auth-screen-btn ${
                  this.state.activePage == "register" ? "active" : null
                }`}
                type="outlined"
                onClick={() => this.setState({ activePage: "register" })}
              >
                Register
              </ButtonUI>
              <ButtonUI
                className={`ml-3 auth-screen-btn ${
                  this.state.activePage == "login" ? "active" : null
                }`}
                type="outlined"
                onClick={() => this.setState({ activePage: "login" })}
              >
                Login
              </ButtonUI>
            </div>
            {this.props.user.errMsg ? (
              <div className="alert alert-danger mt-3">
                {this.props.user.errMsg}
              </div>
            ) : null}
            {this.renderAuthComponent()}
          </div>
          <div className="col-7">
            <img
              src="https://0.soompi.io/wp-content/uploads/2016/10/21084602/Mina.jpg"
              alt=""
              height="580px"
            />
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Forgot Password</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row justify-content-center">
              <TextField
                value={this.state.forgotPass.email}
                placeholder="Email"
                onChange={(e) => this.inputHandler(e, "email", "forgotPass")}
              />
            </div>
            <ButtonUI
              className="w-100"
              onClick={this.sendEmail}
              type="outlined"
            >
              Kirim Email
            </ButtonUI>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onRegister: registerHandler,
  onLogin: loginHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
