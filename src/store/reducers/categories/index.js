const initialState = {
    list: [],
    called: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        case "SET_CATEGORIES":
            return {
                ...state, list: action.payload,
                called: true
            }
        case "LOGOUT":
            return null
        default:
            return state
    }
}