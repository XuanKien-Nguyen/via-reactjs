import service from "../client";

const ENDPOINT = 'api/recharge-success/client'
const ENDPOINT_COMMON = 'api/recharge-success/common'

export const getAllRechargeSuccess = (params) => {
    return service.get(`${ENDPOINT}`, {params: params})
}

export const getSyntaxToTopupBanking = (params) => {
    return service.get(`${ENDPOINT}/syntax-topup-banking`, {params})
}

export const getSyntaxToTopupUSDT = () => {
    return service.get(`${ENDPOINT}/syntax-topup-usdt`)
}

export const getRechargeType = () => {
    return service.get(`${ENDPOINT_COMMON}/type-list`)
}