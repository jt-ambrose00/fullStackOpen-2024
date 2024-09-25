import React, { useReducer } from 'react'
import { useParams } from 'react-router-dom'

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
    <div className='blog'>
      <h2>{blog.title} by {blog.author}</h2>
      <div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>
          {blog.likes} likes
          <button
            style={{ marginLeft: 3 }}
            onClick={() => handleVote(blog)}
          >
            like
          </button>
        </div>
        <div>added by {nameOfUser}</div>
        {canRemove && <button onClick={() => handleDelete(blog)}>
          remove
        </button>}
        <h3>Comments</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Comment:</label>
            <input
              type="text"
              data-testid='comment'
              value={commentState}
              onChange={(e) => commentDispatch({
                type: 'SET_COMMENT', payload: e.target.value
              })}
            />
            <button type="submit">Post</button>
          </div>
        </form>
        {blog.comments.length > 0
          ? blog.comments.map(comment => 
            <p key={comment._id}>{comment.content}</p>
          )
          : <p>No comments yet...</p>
        }
      </div>
    </div>
  )
}

export default Blog
