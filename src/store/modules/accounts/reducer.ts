import * as actionTypes from './constants'
import produce from 'immer'

const defaultState: any = {
  accounts: [],
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CHANGE_ACCOUNTS:
        draft.accounts = action.data
        break
    }
  })
}
