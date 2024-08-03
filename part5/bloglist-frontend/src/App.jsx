import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({text: null, type: ''})
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      errorMessage(error)
      resetMessage()
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
      setMessage({
        text: `a new blog ${blog.title} by ${blog.author} added`,
        type: 'success'
      })
      resetMessage()
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      errorMessage(error)
      resetMessage()
    }
  }

  const updateLikes = async (id, updatedBlog) => {
    try {
      await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      ))
      setMessage({
        text: `liked ${updatedBlog.title} by ${updatedBlog.author}`,
        type: 'success'
      })
      resetMessage()
    } catch (error) {
      errorMessage(error)
      resetMessage()
    }
  }

  const errorMessage = (error) => {
    setMessage({
      text: error.response.data.error,
      type: 'error'
    })
  }

  const resetMessage = () => {
    setTimeout(() => {
      setMessage({text: null, type: ''})
    }, 5000)
  }

  if (user === null) {
    return (
      <>
        <h1>Blogs</h1>
        <Notification text={message.text} type={message.type} />
        <h4>Log in to application</h4>
        {loginForm()}
      </>
    )
  }

  return (
    <>
      <h1>Blogs</h1>
      <Notification text={message.text} type={message.type} />
      <p>{user.name} logged-in</p>
      <button onClick={logout}>logout</button>
      <br />
      <h3>Add a new blog</h3>
      <Togglable buttonLabel='create' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <br />
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
        )}
    </>
  )
}

export default App
