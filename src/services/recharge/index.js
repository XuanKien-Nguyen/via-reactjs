import service from "../client";

const ENDPOINT = 'api/recharge-success/client'

export const getAllRechargeSuccess = (params) => {
    return service.get(`${ENDPOINT}`, {params: params})
}

export const getSyntaxToTopupBanking = (params) => {
    return service.get(`${ENDPOINT}/syntax-topup-banking`, {params})
}

export const getSyntaxToTopupUSDT = () => {
    return service.get(`${ENDPOINT}/syntax-topup-usdt`)
}