import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import history from '../utils/history'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  router: connectRouter(history),
  user: userReducer
})

export default rootReducer;