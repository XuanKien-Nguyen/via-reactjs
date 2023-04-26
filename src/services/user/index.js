import client from "../client";

const ENDPOINT_USER = '/api/users/client'
export const register = (body) => {
    return client.post(`${ENDPOINT_USER}/register`, body)
}

export const checkExistUsername = (body) => {
    return client.post(`${ENDPOINT_USER}/check-exist-username`, body)
}

export const checkExistEmail = (body) => {
    return client.post(`${ENDPOINT_USER}/check-exist-email`, body)
}

export const checkExistPhone = (body) => {
    return client.post(`${ENDPOINT_USER}/check-exist-phone`, body)
}

export const login = (body) => {
    return client.post(`${ENDPOINT_USER}/login`, body)
}

export const getUserInfo = () => {
    return client.get(`${ENDPOINT_USER}/me`)
}

export const logout = () => {
    return client.delete(`${ENDPOINT_USER}/logout`)
}

export const changePassword = (body) => {
    return client.patch(`${ENDPOINT_USER}/change-password/`, body)
}
