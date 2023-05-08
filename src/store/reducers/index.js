import {combineReducers} from 'redux'
import userReducer from "./user";
import categoriesReducer from './categories'
import systemReducer from './system'

const rootReducers = combineReducers({
    user: userReducer,
    categories: categoriesReducer,
    system: systemReducer,
})
export default rootReducers