import service from "../client";
const ENDPOINT = '/api/log-user-balance/manager'

export const getListBalance = (params) => {
    return service.get(`${ENDPOINT}`, {
        params
    })
}