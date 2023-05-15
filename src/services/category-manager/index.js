import service from "../client";
const ENDPOINT = '/api/categories/manager'

export const createCategory = (body) => {
    return service.post(`${ENDPOINT}`, body)
}

export const deleteCategory = (id) => {
    return service.delete(`${ENDPOINT}/${id}`)
}

export const updateCategory = (id, body) => {
    return service.patch(`${ENDPOINT}/${id}`, body)
}

export const swapCategory = (id, body) => {
    return service.patch(`${ENDPOINT}/swap/${id}`, body)
}



