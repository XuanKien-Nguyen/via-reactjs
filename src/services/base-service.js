import Axios from "axios";

const service = Axios.create();

service.defaults.baseURL = process.env.REACT_APP_API_URL;

service.interceptors.request.use(request => {
    // Edit request config
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

// service.interceptors.response.use(response => {
//     // Edit response config
//     return response;
// }, error => {
//     console.log(error);
//     return res;
// });

export default service