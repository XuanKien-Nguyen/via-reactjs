import client from "../client";

const ENDPOINT = '/api/partners/manager'

export const getPartnerList = (params) => {
    return client.get(`${ENDPOINT}`, {params: params})
}

export const getPartnerById = (id) => {
    return client.get(`${ENDPOINT}/${id}`)
}

export const updatePartner = (id, body) => {
    return client.patch(`${ENDPOINT}/${id}`, body)
}

export const getPartnerStatusList = () => {
    return client.get('/api/partners/common/status-list')
}