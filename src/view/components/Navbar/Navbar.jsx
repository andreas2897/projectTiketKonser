import React from "react";
import { Link } from "react-router-dom";
import ButtonUI from "../Button/Button";
import "./Navbar.css";

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    cartCount: 0,
  };
  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            <img
              src="http://emdikeiradio.com/wp-content/uploads/2016/12/Korean-Wave.png"
              style={{ width: "100px", objectFit: "contain", height: "100px" }}
              alt=""
            />
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onChange={this.props.onChangeSearch}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
            }`}
            type="text"
            placeholder="Find your idol here"
            onChange={(e) => {
              this.props.searchProduct(e.target.value);
            }}
          />
        </div>
        <ButtonUI className="mr-3" type="textual">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/auth">
            Sign in
          </Link>
        </ButtonUI>
        <ButtonUI type="contained">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/auth">
            Sign up
          </Link>
        </ButtonUI>
      </div>
    );
  }
}

export default Navbar;
