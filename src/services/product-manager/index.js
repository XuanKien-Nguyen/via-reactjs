import client from "../client";

const ENDPOINT = '/api/products/manager'
const ENDPOINT_DOWNLOAD = '/api/products/admin'
export const getPropertiesProduct = () => {
    return client.get(`${ENDPOINT}/properties`)
}

export const getProductList = (params) => {
    return client.get(`${ENDPOINT}`, {params})
}

export const createProduct = (body) =>{
    return client.post(`${ENDPOINT}`, body)
}

export const downloadNotSoldProduct = (body) =>{
    return client.post(`${ENDPOINT_DOWNLOAD}/download-product-notsold`, body)
}