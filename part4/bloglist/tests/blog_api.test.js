const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

let token
const initialBlogs = [
    {
      title: 'React Patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salainen', 10)
    let initialUser = new User({
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        passwordHash
    })
    await initialUser.save()

    let blogObject = new Blog({ ...initialBlogs[0], user: initialUser._id })
    await blogObject.save()
    blogObject = new Blog({ ...initialBlogs[1], user: initialUser._id })
    await blogObject.save()
    blogObject = new Blog({ ...initialBlogs[2], user: initialUser._id })
    await blogObject.save()

    const userForToken = {
        username: initialUser.username,
        id: initialUser._id,
    }
    token = jwt.sign(userForToken, process.env.SECRET)
})

test('correct number of blogs returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('verify that unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert.strictEqual(blog.hasOwnProperty('id'), true)
        assert.strictEqual(blog.hasOwnProperty('_id'), false)
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('First class tests'))
})

test('a blog can be added without specifying likes', async () => {
    const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)

    assert.strictEqual(likes[response.body.length - 1], 0)
})

test('blog won\'t be added without title/url', async () => {
    const noTitle = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
    }

    const noUrl = {
        title: 'First class tests',
        author: 'Robert C. Martin'
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(noTitle)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(noUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('a blog can be deleted', async () => {
    const startingBlogs = await api.get('/api/blogs')
    const blogToDelete = startingBlogs.body[1]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const endingBlogs = await api.get('/api/blogs')
    const titles = endingBlogs.body.map(e => e.title)

    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(endingBlogs.body.length, initialBlogs.length - 1)
})

test('a blog can be updated', async () => {
    const startingBlogs = await api.get('/api/blogs')
    const blogToUpdate = startingBlogs.body[2]
    blogToUpdate.likes++

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const endingBlogs = await api.get('/api/blogs')
    const updatedBlog = endingBlogs.body[2]

    assert.strictEqual(updatedBlog.likes, initialBlogs[2].likes + 1)
})

test('blog can\'t be added without a valid token', async () => {
    const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert(!titles.includes('First class tests'))
})

after(async () => {
    await mongoose.connection.close()
})
