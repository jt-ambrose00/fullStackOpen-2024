import { useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import storage from './services/storage'

import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { notificationMessage } from './reducers/notificationReducer'
import { initializeBlogs, addVote, removeBlog } from './reducers/blogReducer'
import { setUser, loginUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const blogFormRef = createRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const existingUser = storage.loadUser()
    if (existingUser) {
      dispatch(setUser(existingUser))
    }
  }, [dispatch])

  useEffect(() => {
    if (user) {
      dispatch(notificationMessage(`Welcome back, ${user.name}`, 'success', 5))
    }
  }, [user, dispatch])

  const handleLogin = async (credentials) => {
    try {
      dispatch(loginUser(credentials))
    } catch (error) {
      dispatch(notificationMessage('Wrong credentials', 'failure', 5))
    }
  }

  const handleLogout = () => {
    storage.removeUser()
    dispatch(setUser(null))
    dispatch(notificationMessage(`Bye, ${user.name}!`, 'success', 5))
  }

  const handleVote = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    dispatch(addVote(updatedBlog))
    dispatch(notificationMessage(
      `You liked ${updatedBlog.title} by ${updatedBlog.author}`, 'success', 5
    ))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
      dispatch(notificationMessage(
        `${blog.title} by ${blog.author} was removed`, 'success', 5
      ))
    }
  }

  const byLikes = (a, b) => b.likes - a.likes

  if (!user) {
    return (
      <div>
        <h2>Blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog blogFormRef={blogFormRef} />
      </Togglable>
      {blogs.slice().sort(byLikes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App
