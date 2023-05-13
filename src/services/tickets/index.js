import service from "../client";

const ENDPOINT = 'api/recharge-tickets'

export const createRechargeTickets = (body) => {
    return service.post(`${ENDPOINT}/client`, body)
}

export const getAllRechargeTickets = (params) => {
    return service.get(`${ENDPOINT}/client`, {params})
}

export const getSyntaxToTopupUSDT = () => {
    return service.get(`${ENDPOINT}/common/status-list`)
}