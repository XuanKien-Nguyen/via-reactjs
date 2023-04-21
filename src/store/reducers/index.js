import {combineReducers} from 'redux'
import {categoryReducer} from "./category";
import {userReducer} from "./user";

const rootReducers = combineReducers({
    people: categoryReducer,
    user: userReducer
})
export default rootReducers