import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
      setNotification(state, action) {
        return action.payload
      },
      removeNotification(state, action) {
        return ''
      }
    }
})

export const notificationMessage = (message) => {
    return (dispatch) => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
    }
}

export const { setNotification, removeNotification } 
    = notificationSlice.actions
export default notificationSlice.reducer
