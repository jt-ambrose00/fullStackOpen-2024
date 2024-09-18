import { useState, useEffect, createRef } from 'react'
import { useDispatch } from 'react-redux'

import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'

import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { notificationMessage } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const blogFormRef = createRef()

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

  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog)
    setBlogs(blogs.concat(newBlog))
    dispatch(notificationMessage(
      `Added ${newBlog.title} by ${newBlog.author}`, 'success', 5
    ))
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1
    })
    setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    dispatch(notificationMessage(
      `You liked ${updatedBlog.title} by ${updatedBlog.author}`, 'success', 5
    ))
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    dispatch(notificationMessage(`Bye, ${user.name}!`, 'success', 5))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Removed ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      dispatch(notificationMessage(
        `${blog.title} by ${blog.author} was removed`, 'success', 5
      ))
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

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
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {blogs.sort(byLikes).map(blog =>
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
