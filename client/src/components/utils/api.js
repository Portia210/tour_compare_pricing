import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API,
});
