const initialState = {
    breadscrumb: {
        name: '',
        path: '/',
        children: null
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case "SET_BREADSCRUMB":
            return {
                ...state,
                breadscrumb: {
                    name: action.payload.name,
                    path: action.payload.path,
                    children: null
                }
            }
        case "SET_CHILDREN_BREADSCRUMB":
            return {
                ...state,
                breadscrumb: {
                    ...state.breadscrumb,
                    children: action.payload
                }
            }
        default:
            return state
    }
}