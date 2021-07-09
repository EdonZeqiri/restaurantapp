import { combineReducers } from "redux";
import authReducer from "./reducers/auth/authReducers";
import registerReducer from "./reducers/auth/registerReducers";
import searchReducer from "./reducers/search/searchReducers";
export default combineReducers({
  auth: authReducer,
  register: registerReducer,
  search: searchReducer,
});
