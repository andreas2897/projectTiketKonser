import Axios from "axios";
// import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
import { API_URL } from "../../constants/API";
import swal from "sweetalert";

const {
  ON_LOGIN_FAIL,
  ON_LOGIN_SUCCESS,
  ON_LOGOUT_SUCCESS,
  ON_UPDATE_QUANTITY_CART,
  ON_REGISTER_SUCCESS,
  ON_REGISTER_FAIL,
} = userTypes;

const cookieObj = new Cookie();

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
    Axios.get(`${API_URL}/users/keeplogin`, {
      params: {
        id: userData.id,
      },
    })
      .then((res) => {
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
        // Axios.get(`${API_URL}/carts`, {
        //   params: {
        //     userId: res.data[0].id,
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
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: "Username atau password salah",
        });
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
    Axios.post(`${API_URL}/users`, {
      ...userData,
      role: "user",
    })
      .then((res) => {
        swal("Success!", "Register Success", "success");
        dispatch({
          type: ON_REGISTER_SUCCESS,
          payload: res.data,
        });
        Axios.get(`${API_URL}/carts/user/${res.data.id}`)
          .then((res) => {
            dispatch({
              type: ON_UPDATE_QUANTITY_CART,
              payload: res.data.length,
            });
          })
          .catch((err) => {
            alert("GA MASUK");
            console.log(err);
          });
        console.log(res);
      })
      .catch((err) => {
        dispatch({
          type: ON_REGISTER_FAIL,
          payload: err.response.data.message,
        });
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

export const qtyCartHandler = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts/user/${userId}`)
      .then((res) => {
        dispatch({
          type: ON_UPDATE_QUANTITY_CART,
          payload: res.data.length,
        });
      })
      .catch((err) => {
        alert("GA MASUK");
        console.log(err);
      });
  };
};
