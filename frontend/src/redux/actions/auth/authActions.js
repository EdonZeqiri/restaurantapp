import axios from "../../../helpers/axios";
import { authConstants } from "../../constants/constants";
import swal from "sweetalert";

export const login = (user) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    axios
      .post(`/auth/login`, { ...user })
      .then((res) => {
        const { token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            user,
            token,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: { error: err },
        });
        swal(`Something went wrong`, `Please try again`, "warning", {
          buttons: {
            OK: true,
          },
        });
      });
  };
};

export const logout = () => {
  return async (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
  };
};
