import Axios from "axios";
// import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

const cookieObj = new Cookie();

const API_URL = "http://localhost:8080";

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password } = userData;
    Axios.get(`${API_URL}/users/login`, {
      params: {
        username,
        password,
      },
    })
      .then((res) => {
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
        Axios.get(`${API_URL}/carts`, {
          params: {
            userId: res.data.id,
          },
        })
          .then((res) => {
            dispatch({
              type: "FILL_CART",
              payload: res.data.length,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: "Username atau password salah",
        });
      });
  };
};

export const userKeepLogin = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: userData.id,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
          Axios.get(`${API_URL}/carts`, {
            params: {
              userId: res.data[0].id,
            },
          })
            .then((res) => {
              dispatch({
                type: "FILL_CART",
                payload: res.data.length,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username atau password salah",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  cookieObj.remove("authData", { path: "/" });
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const registerHandler = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users/username`, {
      params: {
        username: userData.username,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: "ON_REGISTER_FAIL",
            payload: "Username sudah digunakan",
          });
          alert("ga masuk");
        } else {
          Axios.post(`${API_URL}/users`, {
            username: userData.username,
            password: userData.password,
            email: userData.email,
          })
            .then((res) => {
              dispatch({
                type: ON_LOGIN_SUCCESS,
                payload: res.data,
              });
              alert("hore");
              // Axios.get(`${API_URL}/carts`, {
              //   params: {
              //     userId: res.data.id,
              //   },
              // })
              //   .then((res) => {
              //     dispatch({
              //       type: "FILL_CART",
              //       payload: res.data.length,
              //     });
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //   });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};

export const fillCart = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId,
      },
    })
      .then((res) => {
        dispatch({
          type: "FILL_CART",
          payload: res.data.length,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};