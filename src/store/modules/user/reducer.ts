import * as actionTypes from './constants'
import produce from 'immer'

const defaultState: any = {
  userData: {},
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CHANGE_USER_DATA:
        draft.rankList = action.data
        break
    }
  })
}
