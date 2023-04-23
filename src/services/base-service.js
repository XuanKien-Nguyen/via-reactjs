import Axios from "axios";

const service = Axios.create({
    // withCredentials: true
});

service.defaults.baseURL = process.env.REACT_APP_API_URL;

service.interceptors.request.use(request => {
    // Edit request config
    return request;
}, error => {
    return Promise.reject(error);
});

service.interceptors.response.use(response => {
    // Edit response config
    console.log(response.headers['set-cookie']);
    console.log(response);
    return response;
}, error => {
    return error.response;
});

export default service