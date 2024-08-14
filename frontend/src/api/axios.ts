import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
