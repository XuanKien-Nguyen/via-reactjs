import client from "../client";

const ENDPOINT = '/api/products/manager'
export const getPropertiesProduct = () => {
    return client.get(`${ENDPOINT}/properties`)
}

export const getProductList = (params) => {
    return client.get(`${ENDPOINT}`, {params})
}

export const createProduct = (body) =>{
    return client.post(`${ENDPOINT}`, body)
}