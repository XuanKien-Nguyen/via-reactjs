import Axios from "axios";

const client = Axios.create({
});

client.defaults.baseURL = process.env.REACT_APP_API_URL;

client.interceptors.request.use(request => {
    // Edit request config
    return request;
}, error => {
    return Promise.reject(error);
});

client.interceptors.response.use(response => {
    // Edit response config
    return response;
}, error => {
    return error.response;
});

export default client