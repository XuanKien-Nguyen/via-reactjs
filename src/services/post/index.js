import client from "../client";

const ENDPOINT = '/api/posts'

export const getPostListCommon = (params) => {
    return client.get(`${ENDPOINT}/common/post-list`, {params: params})
}

export const createPost = (body) => {
    return client.post(`${ENDPOINT}/manager`, body)
}