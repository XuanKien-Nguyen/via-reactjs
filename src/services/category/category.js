import service from "../client";
const ENDPOINT_CATEGORY = '/api/categories/common'

export const getCategoryList = (params) => {
    return service.get(`${ENDPOINT_CATEGORY}/category-list`, {params: params})
}

export const getParentCategoryList = (params) => {
    return service.get(`${ENDPOINT_CATEGORY}/parent-category`,  {params: params})
}

export const getChildCategoryList = (params) => {
    return service.get(`${ENDPOINT_CATEGORY}/child-category`,  {params: params})
}

export const getStatusList = () => {
    return service.get(`${ENDPOINT_CATEGORY}/status-list`)
}

export const getTypeList = () => {
    return service.get(`${ENDPOINT_CATEGORY}/type-list`)
}

export const getLocationList = () => {
    return service.get(`${ENDPOINT_CATEGORY}/locaion-list`)
}