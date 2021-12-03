import axiosClient from "./axiosClient";

const serviceApi = {
  getAll(params) {
    const url = "/services";
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/services/${id}`;
    return axiosClient.get(url);
  },
};
export default serviceApi;
