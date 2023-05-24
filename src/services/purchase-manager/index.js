import service from "../client";
const ENDPOINT = '/api/purchases/manager'

export const purchaseList = (params) => {
    return service.get(`${ENDPOINT}`,  {params: params})
}

export const purchaseDetail = (id, params) => {
    return service.get(`${ENDPOINT}/${id}`, {params})
}