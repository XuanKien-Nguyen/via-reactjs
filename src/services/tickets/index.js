import service from "../client";

const ENDPOINT = '/api/recharge-tickets'

export const createRechargeTickets = (body) => {
    return service.post(`${ENDPOINT}/client`, body)
}

export const getAllRechargeTickets = (params) => {
    return service.get(`${ENDPOINT}/client`, {params})
}

export const getRechargeTicketsStatusList = () => {
    return service.get(`${ENDPOINT}/common/status-list`)
}

export const getAllRechargeTicketsMgr = (params) => {
    return service.get(`${ENDPOINT}/manager`, {params})
}

export const getRechargeTicketById = (id) => {
    return service.get(`${ENDPOINT}/manager/${id}`)
}

export const deleteBulkTicket = (body) => {
    return service.post(`${ENDPOINT}/manager/delete-bulk`, body)
}

export const registerSolveTicket = (id) => {
    return service.patch(`${ENDPOINT}/manager/register/${id}`)
}

export const resolveErrorDeposit = (id) => {
    return service.patch(`${ENDPOINT}/manager/resolve-error-deposit`, {pending_recharge_id: id})
}

export const restoringTicket = (id) => {
    return service.patch(`${ENDPOINT}/manager/restore/${id}`)
}

export const rejectTicket = (id, body) => {
    return service.patch(`${ENDPOINT}/manager/reject/${id}`, body)
}

export const exitTicket = (id) => {
    return service.patch(`${ENDPOINT}/manager/exit/${id}`)
}



