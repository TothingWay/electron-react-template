import { combineReducers } from 'redux'
import { reducer as userReducer } from './modules/user/index'

export default combineReducers({
  user: userReducer,
})
