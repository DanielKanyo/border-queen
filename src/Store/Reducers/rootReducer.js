import authReducer from './authReducer'
import tableRootReducer from './TableReducers/tableRootReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authReducer,
  table: tableRootReducer
});

export default rootReducer
