import { useState, useEffect, createRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'

import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { useNotificationDispatch } from './reducers/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  const blogFormRef = createRef()
  const [user, setUser] = useState(null)

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  const updateBlogMutation = useMutation({
    mutationFn: (blog) => blogService.update(blog.id, blog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.map(blog => 
        updatedBlog.id === blog.id ? updatedBlog : blog
      ))
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, id) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(blog => 
        blog.id !== id
      ))
    }
  })

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const notify = (type, payload, messageType = 'success', seconds = 5) => {
    notificationDispatch({ type, payload, messageType })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, seconds * 1000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      storage.saveUser(user)
      notify('LOGIN', `Welcome back, ${user.name}`)
    } catch (error) {
      notify('ERROR', 'Wrong credentials', 'failure')
    }
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    notify('LOGOUT', `Bye, ${user.name}!`)
  }

  const handleVote = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlogMutation.mutate(updatedBlog)
    notify('LIKE', `You liked ${blog.title} by ${blog.author}`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
      notify('DELETE', `${blog.title} by ${blog.author} was removed`)
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

  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return  <div>
      blog service not available due to problems in server
    </div>
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
        <NewBlog notify={notify} blogFormRef={blogFormRef} />
      </Togglable>
      {data.sort((a, b) => b.likes - a.likes).map(blog =>
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
