import React, { useReducer } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Box, Button, TextField } from '@mui/material'

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

      const users = queryClient.getQueryData(['users'])
      queryClient.setQueryData(['users'], users.map(user => 
        newBlog.user.id === user.id
          ? { ...user, blogs: user.blogs.concat(newBlog) }
          : user
      ))
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
    <>
      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            label='Title'
            variant='outlined'
            style={{ marginBottom: 10 }}
            size='small'
            fullWidth
            data-testid='title'
            value={formState.title}
            onChange={(e) => dispatch({
              type: 'SET_TITLE', payload: e.target.value
            })}
          />
        </Box>
        <Box>
          <TextField
            label='URL'
            variant='outlined'
            style={{ marginBottom: 10 }}
            size='small'
            fullWidth
            data-testid='url'
            value={formState.url}
            onChange={(e) => dispatch({
              type: 'SET_URL', payload: e.target.value
            })}
          />
        </Box>
        <Box>
          <TextField
            label='Author'
            variant='outlined'
            style={{ marginBottom: 10 }}
            size='small'
            fullWidth
            data-testid='author'
            value={formState.author}
            onChange={(e) => dispatch({
              type: 'SET_AUTHOR', payload: e.target.value
            })}
          />
        </Box>
        <Button
          variant='contained'
          color='primary'
          style={{ marginBottom: 10 }}
          size='small'
          type='submit'
        >
          Submit
        </Button>
      </form>
    </>
  )
}

export default NewBlog
