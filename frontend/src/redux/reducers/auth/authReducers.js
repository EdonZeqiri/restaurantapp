import { authConstants } from "../../constants/constants";

const initialState = {
  token: null,
  user: {},
  authenticate: false,
  authenticating: false,
  loading: false,
  error: null,
  message: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        authenticating: true,
        loading: true,
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        authenticate: true,
        authenticating: false,
        loading: false,
      };
    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case authConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        authenticate: false,
      };
    case authConstants.USER_REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
        loading: false,
      };
  }
  return state;
};
