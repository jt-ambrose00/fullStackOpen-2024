import { useState, useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import loginService from './services/login'
import storage from './services/storage'

import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { notificationMessage } from './reducers/notificationReducer'
import { initializeBlogs, addVote, removeBlog } from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const [user, setUser] = useState(null)
  const blogFormRef = createRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      storage.saveUser(user)
      dispatch(notificationMessage(`Welcome back, ${user.name}`, 'success', 5))
    } catch (error) {
      dispatch(notificationMessage('Wrong credentials', 'failure', 5))
    }
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
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
