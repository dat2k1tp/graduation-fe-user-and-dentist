import axiosClient from "./axiosClient";

const dentistApi = {
  getAll(params) {
    const url = "/dentists";
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/dentists/${id}`;
    return axiosClient.get(url);
  },
};
export default dentistApi;
