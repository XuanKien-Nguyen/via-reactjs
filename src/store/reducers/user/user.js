import {SET_USER_INFO} from "../../actions/user";

export const initState = {};

export const userReducer = (state, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return action.payload;
        default:
            throw new Error('Unexpected action');
    }
};