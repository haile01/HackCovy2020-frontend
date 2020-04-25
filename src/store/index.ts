import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router';

import history from '../utils/history'
import rootReducer from '../reducers'

const store = createStore(rootReducer, applyMiddleware(routerMiddleware(history)));

export default store;