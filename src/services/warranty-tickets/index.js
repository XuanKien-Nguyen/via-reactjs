import client from "../client";

const ENDPOINT = '/api/warranty-tickets/client'

export const createWarrantyTicket = (body) => {
    return client.post(`${ENDPOINT}`, body)
}

export const getWarrantyTicket = (params) => {
    return client.get(`${ENDPOINT}`, {params})
}

export const getStatusList = () => {
    return client.get(`/api/warranty-tickets/common/status-list`)
}