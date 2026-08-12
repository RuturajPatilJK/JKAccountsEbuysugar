import axios from "axios";

const base_url = process.env.REACT_APP_API
const axiosInstance = axios.create({
  baseURL: base_url,
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  console.log('token ',token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default axiosInstance;
