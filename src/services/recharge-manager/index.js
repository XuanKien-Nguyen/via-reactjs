import client from "../client";

//RechargeSuccess
export const getAllRechargeSuccess = (params) => {
    return client.get('/api/recharge-success/manager', {params: params})
}

export const getTypeListRechargeSuccess = () => {
    return client.get('/api/recharge-success/common/type-list')
}

//RechargePending
export const getAllRechargePending = (params) => {
    return client.get('/api/recharge-pending/manager', {params: params})
}

export const getRechargePendingById = (id) => {
    return client.get(`/api/recharge-pending/manager/${id}`)
}

export const getRechargePendingByTicketId = (id, body) => {
    return client.get(`}/api/recharge-pending/manager/get-by-ticket-id`, body)
}

export const deleteRechargePendingById = (id) => {
    return client.delete(`/api/recharge-pending/manager/${id}`)
}

export const getStatusListRechargePending = () => {
    return client.get('/api/recharge-pending/manager/status-list')
}

export const getTypeListRechargePending = () => {
    return client.get('/api/recharge-pending/manager/type-list')
}