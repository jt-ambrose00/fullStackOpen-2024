import React, { useReducer } from 'react'
import { useParams } from 'react-router-dom'

import {
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

import storage from '../services/storage'

import newBlogReducer from '../reducers/NewBlogReducer'

const Blog = ({ allBlogs, handleVote, handleDelete, handleComment }) => {
  const [commentState, commentDispatch] = useReducer(newBlogReducer, '')

  const id = useParams().id
  const blog = allBlogs.data.find(b => b.id === id)

  if (!blog) {
    return null
  }

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'
  const canRemove = blog.user ? blog.user.username === storage.me() : true
  // console.log(blog.user, storage.me(), canRemove)

  const handleSubmit = (event) => {
    event.preventDefault()
    handleComment(blog.id, commentState)
    commentDispatch({ type: 'RESET_COMMENT' })
  }

  return (
    <>
      <h2>{blog.title} by {blog.author}</h2>
      <Box>
        <Typography style={{ marginBottom: '1em' }}>
          <a href={`https://${blog.url}`}>{blog.url}</a>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1em'
          }}
        >
          <Typography>{blog.likes} likes</Typography>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            startIcon={<ThumbUpIcon />}
            style={{ marginLeft: '1em' }}
            onClick={() => handleVote(blog)}
          >
            Like
          </Button>
        </Box>
        <Typography style={{ marginBottom: '1em' }}>
          Added by {nameOfUser}
        </Typography>
        {canRemove && 
          <Button 
            variant='outlined'
            color='primary'
            size='small'
            startIcon={<DeleteIcon />}
            style={{ marginBottom: '1em' }}
            onClick={() => handleDelete(blog)}
          >
            Remove
          </Button>}
        <h3>Comments</h3>
        <List style={{ marginBottom: '1em' }}>
          {blog.comments.length > 0
            ? blog.comments.map(comment => 
              <ListItem key={comment._id}>
                {comment.content}
              </ListItem>
            )
            : <ListItem>
                No comments yet...
              </ListItem>
          }
        </List>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Comment'
            variant='outlined'
            size='small'
            fullWidth
            multiline
            rows={3}
            data-testid='comment'
            style={{ marginBottom: '0.5em' }}
            value={commentState}
            onChange={(e) => commentDispatch({
              type: 'SET_COMMENT', payload: e.target.value
            })}
          />
          <Button
            variant='contained'
            color='primary'
            size='small'
            type='submit'
            style={{ marginBottom: '1em' }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  )
}

export default Blog
