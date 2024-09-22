import React from 'react'
import { Link } from 'react-router-dom'

const Blogs = ({ blog }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={style} className='blog'>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
    </div>
  )
}

export default Blogs
