import React from 'react'
import { Link } from 'react-router-dom'

import { Divider, ListItem } from '@mui/material'

const Blogs = ({ blog }) => {
  return (
    <>
      <ListItem sx={{ padding: '1em' }}>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title}
        </Link>
        &nbsp;by {blog.author}
      </ListItem>
      <Divider />
    </>
  )
}

export default Blogs
