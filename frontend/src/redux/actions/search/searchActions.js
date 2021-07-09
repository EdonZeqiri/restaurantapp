import { searchConstants } from "../../constants/constants";

export function setQuery(payload) {
  return {
    type: searchConstants.QUERY,
    payload,
  };
}

export function setRating(payload) {
  return {
    type: searchConstants.RATING,
    payload,
  };
}
