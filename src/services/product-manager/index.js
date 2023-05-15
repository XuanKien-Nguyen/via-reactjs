import client from "../client";

const ENDPOINT = '/api/products/manager'
export const getPropertiesProduct = () => {
    return client.get(`${ENDPOINT}/properties`)
}