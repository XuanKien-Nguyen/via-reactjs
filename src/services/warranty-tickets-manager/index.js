import client from "../client";

const ENDPOINT = '/api/warranty-tickets/manager'

export const getWarrantyTicket = (params) => {
    return client.get(`${ENDPOINT}`, {params})
}

export const getComments = (id, type = '') => {
    return client.get(`/api/warranty-ticket-comments/manager/${id}`,
        {params: {type}})
}

export const createWarrantyTicketComment = (body) => {
    return client.post(`/api/warranty-ticket-comments/common`, body)
}

export const refundWarrantyTicket = (id, refund_amount) => {
    return client.patch(`${ENDPOINT}/refund/${id}`, {refund_amount})
}

export const rejectProductRequest = (id, body) => {
    return client.post(`${ENDPOINT}/reject-product/${id}`, body)
}

export const downloadProductToReplace = (id, quantity) => {
    return client.get(`${ENDPOINT}/download-product-to-replace/${id}`, {data: {quantity}})
}

export const markErrorProductToReplace = (id, body) => {
    return client.patch(`${ENDPOINT}/mark-error-product-to-replace/${id}`, body)
}

export const sendProductToReplace = (id, body) => {
    return client.post(`${ENDPOINT}/send-product-to-replace/${id}`, body)
}

export const closeWarrantyTicket = (id) => {
    return client.patch(`${ENDPOINT}/closed-replace/${id}`)
}

export const getProductCheckingList = (id) => {
    return client.get(`${ENDPOINT}/product-checking/${id}`)
}

export const getProductRequestList = (id) => {
    return client.get(`${ENDPOINT}/product-request/${id}`)
}
