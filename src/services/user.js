import service from "./base-service";
const ENDPOINT_USER = '/users/client'
export const register = (body) => {
    return service.post(`${ENDPOINT_USER}/register`, body)
}