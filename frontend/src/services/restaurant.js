import axios from "../helpers/axios";

export const createRestaurant = (payload) => {
  return axios.post(`/restaurants`, payload, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const list = (search) => {
  let temp;
  {
    search.rating !== "" && search.query !== ""
      ? (temp = `/restaurants/list?${search.query}&${search.rating}`)
      : search.query !== ""
      ? (temp = `/restaurants/list?${search.query}`)
      : search.rating !== ""
      ? (temp = `/restaurants/list?${search.rating}`)
      : (temp = `/restaurants/list`);
  }

  return axios.get(temp, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const get = (id) => {
  return axios.get(`/restaurants/${id}`, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const update = (id, payload) => {
  return axios.patch(`/restaurants/${id}`, payload, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const review = (id, payload) => {
  return axios.post(`/restaurants/${id}/reviews`, payload, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const allReviews = (id) => {
  return axios.get(`/restaurants/${id}/reviews`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};
export const pendingReviews = () => {
  return axios.get(`/review/reviewing`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const deleteReview = (id) => {
  return axios.delete(`/review/${id}`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const updateReview = (id, payload) => {
  return axios.patch(`/review/${id}`, payload, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const deleteRestaurant = (id) => {
  return axios.delete(`/restaurants/${id}`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const reply = (id, payload) => {
  return axios.post(`/reply/${id}`, payload, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};
