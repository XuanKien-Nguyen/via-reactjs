import service from "../client";
const ENDPOINT_CATEGORY = '/api/categories/common'

export const getCategoryList = () => {
    return service.get(`${ENDPOINT_CATEGORY}/category-list`)
}
