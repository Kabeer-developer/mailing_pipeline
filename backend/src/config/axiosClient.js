import axios from "axios";

const axiosClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;