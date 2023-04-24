import Axios from "axios";
import {API_WHITE_LIST} from "../utils/constants";

const client = Axios.create({
    withCredentials: true
});

client.interceptors.request.use(async request => {
    console.log(request);
    // if (!API_WHITE_LIST.some(el => el === request.url)) {
    //     await client.get("/api/users/client/reset-token").catch(error => {
    //         // do something
    //         return Promise.reject(error);
    //     })
    //     return client(request);
    // }
    return request;
}, error => {
    return Promise.reject(error);
});

client.interceptors.response.use(response => {
    return response;
}, async error => {
    // if (error?.response?.status === 401 && error.config.url !== '/api/users/client/login') {
    //     console.log(error.config)
    //     await client.get("/api/users/client/reset-token").catch(error => {
    //         // do something
    //         return Promise.reject(error);
    //     })
    //     return client(error.config);
    // }
    return Promise.reject(error);
});

export default client