import axios from "../helpers/axios";

export const list = () => {
  return axios.get(`user/list`, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const deleteUser = (id) => {
  return axios.delete(`/user/${id}`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const get = (id) => {
  return axios.get(`/user/${id}`, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};

export const update = (id, payload) => {
  return axios.patch(`/user/${id}`, payload, {
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "content-type": "application/json",
    },
  });
};
