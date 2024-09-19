import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateVoteTotal(state, action) {
      return state.map(blog =>
        blog.id === action.payload.id 
          ? action.payload
          : blog
      )
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const {
  addBlog,
  setBlogs,
  updateVoteTotal,
  deleteBlog
} = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(addBlog(newBlog))
  }
}

export const addVote = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog.id, blog)
    dispatch(updateVoteTotal(updatedBlog))
  }
}

export const removeBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export default blogSlice.reducer
