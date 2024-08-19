import axios from "axios";

console.log(import.meta.env.API_URL)
export const makeRequest = axios.create({
    baseURL: "http://192.168.0.74:8800",
    withCredentials: true,
})