import authReducer from './authReducer'
import tableReducer from './tableReducer'
import columnReducer from './columnReducer'
import rowReducer from './rowReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authReducer,
  table: tableReducer,
  column: columnReducer,
  row: rowReducer
});

export default rootReducer
