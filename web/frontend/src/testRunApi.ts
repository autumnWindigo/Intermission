import axios from "axios";

const testRunApi = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 100000,
    headers: { "Content-Type": "application/json" },
});

export default testRunApi;
