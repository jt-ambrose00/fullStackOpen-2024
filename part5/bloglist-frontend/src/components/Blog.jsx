import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <>
          <div>
            {blog.url}
          </div>
          <div>
            likes: {blog.likes}
            <button>like</button>
          </div>
          <div>
            {blog.user && blog.user.name ? blog.user.name : 'Unknown user'}
          </div>
        </>
      )}
    </div>
  )
}

export default Blog
