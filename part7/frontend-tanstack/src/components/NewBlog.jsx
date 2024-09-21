import React, { useReducer } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import blogService from '../services/blogs'

import newBlogReducer, { initialState } from '../reducers/NewBlogReducer'

const NewBlog = ({ notify, blogFormRef }) => {
  const [formState, dispatch] = useReducer(newBlogReducer, initialState)

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    }
  })

  const doCreate = async (blog) => {
    newBlogMutation.mutate(blog)
    notify('CREATE', `Added ${blog.title} by ${blog.author}`)
    blogFormRef.current.toggleVisibility()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    doCreate({
      title: formState.title,
      url: formState.url,
      author: formState.author 
    })
    dispatch({ type: 'RESET' })
  }

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            data-testid='title'
            value={formState.title}
            onChange={(e) => dispatch({
              type: 'SET_TITLE', payload: e.target.value
            })}
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            data-testid='url'
            value={formState.url}
            onChange={(e) => dispatch({
              type: 'SET_URL', payload: e.target.value
            })}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            data-testid='author'
            value={formState.author}
            onChange={(e) => dispatch({
              type: 'SET_AUTHOR', payload: e.target.value
            })}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog
