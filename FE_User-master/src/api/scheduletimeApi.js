import axiosClient from "./axiosClient";

const scheduleTimeApi = {
  getById(params) {
    const url = `schedule-time/hour`;
    return axiosClient.get(url,{ params });
  },
  getByDentist(params) {
    const url = "schedule-time/dentist";
    return axiosClient.get(url, { params });
  },
};

export default scheduleTimeApi;
