import authReducer from './authReducer'
import tableReducer from './tableReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'

const rootReducer = combineReducers({
  auth: authReducer,
  table: tableReducer,
  firestore: firestoreReducer,
  firesbase: firebaseReducer
});

export default rootReducer
