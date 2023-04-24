import service from "./client";
const ENDPOINT_CATEGORY = '/categories/common'

export const getCategoryList = () => {
    return service.get(`${ENDPOINT_CATEGORY}/category-list`)
}
