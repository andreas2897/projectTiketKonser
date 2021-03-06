import userTypes from "../types/user";

const {
  ON_LOGIN_FAIL,
  ON_LOGIN_SUCCESS,
  ON_LOGOUT_SUCCESS,
  ON_UPDATE_QUANTITY_CART,
  ON_REGISTER_FAIL,
  ON_REGISTER_SUCCESS,
} = userTypes;

const init_state = {
  id: 0,
  username: "",
  role: "",
  errMsg: "",
  cookieChecked: false,
  cartItems: 0,
  email: "",
  password: "",
  is_verified: "",
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username, role, id } = action.payload;
      return {
        ...state,
        username,
        role,
        id,
        cookieChecked: true,
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state, cookieChecked: true };
    case "COOKIE_CHECK":
      return { ...state, cookieChecked: true };
    case "FILL_CART":
      return { ...state, cartItems: action.payload };
    case ON_REGISTER_SUCCESS:
      return {
        ...init_state,
        cookieChecked: true,
      };
    case ON_REGISTER_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked: true };
    default:
      return { ...state };
  }
};
