import * as actionTypes from './constants'

export const changeUserData = (data: any) => ({
  type: actionTypes.CHANGE_USER_DATA,
  data,
})
