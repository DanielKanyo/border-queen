import authReducer from './authReducer'
import tableReducer from './tableReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authReducer,
  table: tableReducer
});

export default rootReducer
