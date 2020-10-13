import * as actionTypes from './constants'
import produce from 'immer'

const defaultState: any = {
  socket: null,
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CHANGE_SOCKET:
        draft.socket = action.data
        break
    }
  })
}
