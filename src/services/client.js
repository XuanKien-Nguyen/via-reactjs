import Axios from "axios";
import {API_WHITE_LIST} from "../utils/constants";
import {message} from "antd";

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
                        localStorage.removeItem('is_logged')
                        localStorage.removeItem('user_info')
                        // if (['refresh_token must be provide', 'token has been conflict'].includes(err.response?.data?.error)) {
                        //     window.location.href = '/login'
                        // }
                        window.location.href = '/login'
                        processQueue(err);
                        reject(err);
                    })
                    .then(() => {
                        isRefreshing = false;
                    });
            });
        } else if (err.response?.data?.error === 'refresh_token is invalid' && err.config.url !== '/api/users/client/me') {
            message.error('Phiên đăng nhập đã hết hạn')
            localStorage.removeItem('is_logged')
            localStorage.removeItem('user_info')
            window.location.href = '/'
        }
        return Promise.reject(err);
    }
);

export default client