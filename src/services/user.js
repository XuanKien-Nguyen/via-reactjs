import service from "./base-service";
const ENDPOINT_USER = '/users/client'
export const register = (body) => {
    return service.post(`${ENDPOINT_USER}/register`, body)
}

export const checkExistUsername = (body) => {
    return service.post(`${ENDPOINT_USER}/check-exist-username`, body)
}

export const checkExistEmail = (body) => {
    return service.post(`${ENDPOINT_USER}/check-exist-email`, body)
}

export const checkExistPhone = (body) => {
    return service.post(`${ENDPOINT_USER}/check-exist-phone`, body)
}
