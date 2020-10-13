import { combineReducers } from 'redux'
import { reducer as userReducer } from './modules/user/index'
import { reducer as socketReducer } from './modules/socket/index'

export default combineReducers({
  user: userReducer,
  socket: socketReducer,
})
