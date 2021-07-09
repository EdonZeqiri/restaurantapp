import { searchConstants } from "../../constants/constants";

const initialState = {
  query: "",
  rating: "",
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case searchConstants.QUERY:
      return {
        ...state,
        query: action.payload !== "" ? `query=${action.payload}` : "",
      };
    case searchConstants.RATING:
      return {
        ...state,
        rating: action.payload !== "" ? `rating=${action.payload}` : "",
      };
    default:
      return state;
  }
};
export default searchReducer;
