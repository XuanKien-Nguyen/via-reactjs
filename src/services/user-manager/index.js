import client from "../client";

const ENDPOINT = '/api/users/manager'

export const getUserListForAdmin = (params) => {
    return client.get(`${ENDPOINT}/admin`, {params: params})
}

export const getUserListForStaff = (params) => {
    return client.get(`${ENDPOINT}/staff`, {params: params})
}

export const getUserByIdForAdmin = (id) => {
    return client.get(`${ENDPOINT}/admin/${id}`)
}

export const getUserByIdForStaff = (id) => {
    return client.get(`${ENDPOINT}/staff/${id}`)
}

export const getUserStatusList = () => {
    return client.get(`/api/users/common/status-list`)
}

export const getUserRoleList = () => {
    return client.get(`/api/users/common/role-list`)
}

export const updateUserForAdmin = (id, body) => {
    return client.patch(`${ENDPOINT}/admin/${id}`, body)
}

export const updateUserForStaff = (id, body) => {
    return client.patch(`${ENDPOINT}/staff/${id}`, body)
}