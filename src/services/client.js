import Axios from "axios";
import {API_WHITE_LIST} from "../utils/constants";

const client = Axios.create({
    withCredentials: true
});

client.interceptors.request.use(async request => {
    if (request.url !== '/api/users/client/reset-token' && !API_WHITE_LIST.some(el => el === request.url)) {
        await client.patch("/api/users/client/reset-token").catch(() => {
            // if (window.location.pathname !== '/') {
            //     window.location.href = '/'
            // }
        });
    }
    return request;
}, error => {
    return Promise.reject(error);
});

client.interceptors.response.use(response => {
    return response;
}, async error => {
    return Promise.reject(error);
});

export default client