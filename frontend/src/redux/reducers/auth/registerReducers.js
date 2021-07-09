import { registerConstants } from "../../constants/constants";

const initState = {
  error: null,
  message: "",
  loading: false,
  user: {},
  created: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case registerConstants.USER_REGISTER_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case registerConstants.USER_REGISTER_SUCCESS:
      state = {
        ...state,
        loading: false,
        user: action.payload.user,
        message: action.payload.message,
        created: true,
      };
      break;
    case registerConstants.USER_REGISTER_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
  }
  return state;
};
