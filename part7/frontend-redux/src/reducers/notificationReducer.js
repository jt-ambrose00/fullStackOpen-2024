import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      const { message, type } = action.payload
      return { message, type }
    },
    removeNotification(state, action) {
      return null
    }
  }
})

export const {
  setNotification,
  removeNotification 
} = notificationSlice.actions

export const notificationMessage = (message, type, timeout) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
