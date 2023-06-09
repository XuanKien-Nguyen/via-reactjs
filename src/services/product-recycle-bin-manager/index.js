import client from "../client";

const ENDPOINT = '/api/product-recycle-bin/manager'
export const getProductRecycleBinList = (params) => {
    return client.get(`${ENDPOINT}`, {params: params})
}

export const downloadProductSold = (body) => {
    return client.post(`${ENDPOINT}/download-product-sold`, body)
}

export const downloadProductCheckpoint = () => {
    return client.get(`${ENDPOINT}/download-product-checkpoint`)
}

export const downloadProductError = () => {
    return client.get(`${ENDPOINT}/download-product-error`)
}

export const downloadProductRequest = () => {
    return client.get(`${ENDPOINT}/download-product-request`)
}

export const getProductRecycleBinTypeList = () =>{
    return client.get(`${ENDPOINT}/type-list`)
}