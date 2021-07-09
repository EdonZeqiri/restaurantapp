import axios from "../../../helpers/axios";
import { registerConstants } from "../../constants/constants";
import { Redirect, useHistory } from "react-router-dom";
import swal from "sweetalert";

export const signup = (user) => {
  return async (dispatch) => {
    dispatch({ type: registerConstants.USER_REGISTER_REQUEST });
    axios
      .post(`/auth/register`, {
        ...user,
      })
      .then((res) => {
        const { user, token, message } = res.data;
        dispatch({
          type: registerConstants.USER_REGISTER_SUCCESS,
          payload: { user, token, message },
        });
        swal(``, `The user has been created`, "success", {
          buttons: {
            OK: true,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: registerConstants.USER_REGISTER_FAILURE,
          payload: { error: error.message },
        });
        swal(`Something went wrong`, `please try again `, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };
};
