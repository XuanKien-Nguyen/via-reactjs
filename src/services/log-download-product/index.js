import client from "../client";
const ENDPOINT = '/api/log-download-product/manager/'

export const getListLogDownloadProduct = (params) =>{
    return client.get(`${ENDPOINT}`, {params: params})
}