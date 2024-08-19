import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
      searchTerm(state, action) {
        return action.payload
      }
    }
  })

export const { searchTerm } = filterSlice.actions
export default filterSlice.reducer
