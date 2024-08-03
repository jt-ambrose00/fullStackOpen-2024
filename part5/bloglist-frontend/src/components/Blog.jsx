import { useState } from 'react'

const Blog = (props) => {
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

  const addLikeToBlog = async () => {
    const updatedBlog = {...props.blog, likes: props.blog.likes + 1}
    props.updateLikes(props.blog.id, updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {props.blog.title} by {props.blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <>
          <div>
            {props.blog.url}
          </div>
          <div>
            likes: {props.blog.likes}
            <button onClick={addLikeToBlog}>like</button>
          </div>
          <div>
            {props.blog.user && props.blog.user.name 
              ? props.blog.user.name 
              : 'Unknown user'
            }
          </div>
        </>
      )}
    </div>
  )
}

export default Blog
