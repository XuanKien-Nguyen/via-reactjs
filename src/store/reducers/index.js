import {combineReducers} from 'redux'
import userReducer from "./user";
import categoriesReducer from './categories'

const rootReducers = combineReducers({
    user: userReducer,
    categories: categoriesReducer
})
export default rootReducers