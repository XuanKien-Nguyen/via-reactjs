import service from "../client";
const ENDPOINT = '/api/purchases/client'
const ENDPOINT_COMMON = 'api/purchases/common'

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

export const getPurchaseType = () => {
    return service.get(`${ENDPOINT_COMMON}/type-list`)
}

export const getPurchaseStatus = () => {
    return service.get(`${ENDPOINT_COMMON}/status-list`)
}