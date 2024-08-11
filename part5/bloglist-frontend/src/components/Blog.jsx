import { useState } from 'react'

const Blog = (props) => {
  const [visible, setVisible] = useState(false)
  const userBlog = props.blog.user.username === props.currentUser.username

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
    const updatedBlog = { ...props.blog, likes: props.blog.likes + 1 }
    props.updateLikes(props.blog.id, updatedBlog)
  }

  const removeBlog = async () => {
    props.removeBlogIfAddedByUser(props.blog.id, props.blog)
  }

  return (
    <div className='blogEntry' style={blogStyle}>
      <div className='initialBlogInfo'>
        {props.blog.title} by {props.blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <>
          <div className='url'>
            {props.blog.url}
          </div>
          <div className='likes'>
            likes: {props.blog.likes}
            <button className='likeButton' onClick={addLikeToBlog}>
              like
            </button>
          </div>
          <div>
            {props.blog.user && props.blog.user.name
              ? props.blog.user.name
              : 'Unknown user'
            }
          </div>
          {userBlog && <button onClick={removeBlog}>remove</button>}
        </>
      )}
    </div>
  )
}

export default Blog
