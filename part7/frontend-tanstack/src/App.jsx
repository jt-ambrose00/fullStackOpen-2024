import { useEffect, createRef, useContext } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Container } from '@mui/material'

import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'
import userService from './services/users'

import Login from './components/Login'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

import { useNotificationDispatch } from './reducers/NotificationContext'
import UserContext from './reducers/UserContext'

const App = () => {
  const queryClient = useQueryClient()
  const blogFormRef = createRef()
  const navigate = useNavigate()
  const notificationDispatch = useNotificationDispatch()
  const [user, userDispatch] = useContext(UserContext)

  const allBlogs = useQuery({
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
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, id) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(blog => 
        blog.id !== id
      ))

      const users = queryClient.getQueryData(['users'])
      queryClient.setQueryData(['users'], users.map(user => ({
        ...user,
        blogs: user.blogs.filter(blog => blog.id !== id)
      })))
    }
  })

  const newCommentMutation = useMutation({
    mutationFn: (commentObject) => blogService.createComment(commentObject),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.map(blog => 
        updatedBlog._id === blog.id ? updatedBlog : blog
      ))
    }
  })

  const notify = (type, payload, messageType = 'success', seconds = 5) => {
    notificationDispatch({ type, payload, messageType })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, seconds * 1000)
  }

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      userDispatch({ type: 'SET_USER', payload: user })
    }
  }, [])

  const loginMutation = useMutation({
    mutationFn: (credentials) => loginService.login(credentials)
  })

  const handleLogin = async (credentials) => {
    loginMutation.mutate(credentials, {
      onSuccess: (loggedInUser) => {
        userDispatch({ type: 'SET_USER', payload: loggedInUser })
        storage.saveUser(loggedInUser)
        notify('LOGIN', `Welcome back, ${loggedInUser.name}`)
        navigate('/')
      },
      onError: () => {
        notify('ERROR', 'Wrong credentials', 'error')
      }
    })
  }

  const handleLogout = () => {
    userDispatch({ type: 'REMOVE_USER' })
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
      navigate('/')
    }
  }

  const handleComment = async (id, comment) => {
    newCommentMutation.mutate({ id, comment })
    notify('COMMENT', `Comment added`)
  }

  const allUsers = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

  if (!user) {
    return (
      <Container>
        <h2>Bloglist</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </Container>
    )
  }

  if (allBlogs.isPending) {
    return <div>Loading blogs...</div>
  }

  if (allBlogs.isError) {
    return  <div>
      Blog service not available due to problems in server
    </div>
  }

  if (allUsers.isPending) {
    return <div>Loading users...</div>
  }

  if (allUsers.isError) {
    return  <div>
      User service not available due to problems in server
    </div>
  }

  return (
    <Container>
      <h2>Bloglist</h2>
      <Navbar handleLogout={handleLogout} />
      <Notification />
      <Routes>
        <Route path='/' element={
          <>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <NewBlog notify={notify} blogFormRef={blogFormRef} />
            </Togglable>
            {allBlogs.data.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blogs key={blog.id} blog={blog} />
            )}
          </>
        } />
        <Route path="/blogs/:id" element={
          <Blog
            allBlogs={allBlogs}
            handleVote={handleVote}
            handleDelete={handleDelete}
            handleComment={handleComment}
          />
        }/>
        <Route path="/users/:id" element={<User allUsers={allUsers} />} />
        <Route path='/users' element={<Users allUsers={allUsers} />} />
      </Routes>
      <Footer />
    </Container>
  )
}

export default App
