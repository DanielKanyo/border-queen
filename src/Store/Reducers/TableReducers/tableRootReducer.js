import tableDetailsReducer from './tableDetailsReducer'
import tableRowsReducer from './tableRowsReducer'
import tableSettingsReducer from './tableSettingsReducer'
import { combineReducers } from 'redux'

const tableRootReducer = combineReducers({
  detail: tableDetailsReducer,
  row: tableRowsReducer,
  setting: tableSettingsReducer
});

export default tableRootReducer
