const initialState = {
    breadcrumb: {
        name: '',
        path: '/',
        children: null
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case "SET_BREADCRUMB":
            return {
                ...state,
                breadcrumb: {
                    name: action.payload.name,
                    path: action.payload.path,
                    children: null
                }
            }
        case "SET_CHILDREN_BREADCRUMB":
            return {
                ...state,
                breadcrumb: {
                    ...state.breadcrumb,
                    children: action.payload
                }
            }
        default:
            return state
    }
}