import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'
import { notificationMessage } from '../reducers/notificationReducer'

const NewBlog = ({ blogFormRef }) => {
  const dispatch = useDispatch()

  const handleCreate = async (event) => {
    event.preventDefault()

    const title = event.target.title.value
    const url = event.target.url.value
    const author = event.target.author.value

    event.target.title.value = ''
    event.target.url.value = ''
    event.target.author.value = ''

    const content = { title, url, author }

    dispatch(createBlog(content))
    dispatch(notificationMessage(`Added ${title} by ${author}`, 'success', 5))
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            data-testid='title'
            name='title'
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            data-testid='url'
            name='url'
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            data-testid='author'
            name='author'
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog
