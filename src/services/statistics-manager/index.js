import client from "../client";

const ENDPOINT = '/api/statistics/manager';

export const getAllStatistics = (params) => {
    return client.get(`${ENDPOINT}`, {params: params})
}