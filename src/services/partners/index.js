import client from "../client";

const ENDPOINT = '/api/partners/client'
export const checkStatus = () => {
    return client.get(`${ENDPOINT}/check-status`)
}

export const registerPartner = (body) => {
    return client.post(`${ENDPOINT}/register-partner`, body)
}

export const getInfoClientPartner = () => {
    return client.get(`${ENDPOINT}/`)
}