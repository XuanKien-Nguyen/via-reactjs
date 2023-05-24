import client from "../client";
const ENDPOINT = '/api/log-user-login/manager/'

export const getLogUserLogin = (params) =>{
    return client.get(`${ENDPOINT}`, {params: params})
}