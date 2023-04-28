import service from "../client";
const ENDPOINT = '/api/purchases/client'

export const createPurchase = (body) => {
    return service.post(`${ENDPOINT}`, body)
}

export const purchaseList = (params) => {
    return service.get(`${ENDPOINT}`,  {params: params})
}

export const purchaseDetail = (id) => {
    return service.get(`${ENDPOINT}/${id}`)
}

export const downloadPurchase = (id) => {
    return service.get(`${ENDPOINT}/download/${id}`)
}