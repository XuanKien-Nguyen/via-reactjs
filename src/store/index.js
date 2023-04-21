import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducers from "./reducers";
const index = createStore(rootReducers, applyMiddleware(thunk))

export default index