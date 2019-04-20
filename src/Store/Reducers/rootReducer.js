import authReducer from './authReducer'
import tableReducer from './tableReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'

const rootReducer = combineReducers({
  auth: authReducer,
  table: tableReducer,
  firestore: firestoreReducer
});

export default rootReducer
