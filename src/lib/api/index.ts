import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL }); // axiosのインスタンス生成
api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;