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

export const getComments = (id, type) => {
    if (!type) {
        type = ''
    }
    return client.get(`/api/warranty-ticket-comments/client`,
        {warranty_ticket_id: id},
        {params: {type}})
}

export const getListTypeComment = () => {
    return client.get(`/api/warranty-ticket-comments/common/type-list`)
}

export const createWarrantyTicketComment = (body) => {
    return client.get(`/api/warranty-ticket-comments/common`, body)
}

