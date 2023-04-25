const initialState = null

export default (state = initialState, action) => {
    switch(action.type) {
        case "SET_USER_INFO":
            return action.payload
        case "LOGOUT":
            return null
        default:
            return state
    }
}