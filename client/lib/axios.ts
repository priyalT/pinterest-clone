import axios from "axios";

const api = await axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL});

export default api;
