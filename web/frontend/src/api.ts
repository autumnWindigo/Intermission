//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Axios API connection to frontend

import axios from "axios";

const api = axios.create({
    baseURL: "http:localhost:8000/api", // Might have to change port
    timeout: 1000,
    headers: { "Content-Type": "application/json" },
});

export default api;
