import Axios from "axios";
import {API_WHITE_LIST} from "../utils/constants";

const client = Axios.create({
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });

    failedQueue = [];
};

client.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        const originalRequest = err.config;
        if (err.response.status === 401 && !originalRequest._retry && !API_WHITE_LIST.some(el => el === err.config.url)) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(() => {
                        return client(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {

                Axios('/api/users/client/reset-token', {
                    method: 'patch',
                    withCredentials: true
                })
                    .then(() => {
                        processQueue(null);
                        resolve(client(originalRequest));
                    })
                    .catch(err => {
                        // message.error('refresh token error')
                        processQueue(err);
                        reject(err);
                    })
                    .then(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(err);
    }
);

export default client