const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ 
            username: 'root',
            name: 'Superuser',
            passwordHash
        })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await api.get('/api/users')

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')
        const usernames = response.body.map(u => u.username)

        assert.strictEqual(response.body.length, usersAtStart.body.length + 1)
        assert(usernames.includes(newUser.username))
    })

    test('cannot add invalid user', async () => {
        const usersAtStart = await api.get('/api/users')

        const takenUsername = {
            username: 'root',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        const noUsername = {
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        const shortUsername = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        const noPassword = {
            username: 'mluukkai',
            name: 'Matti Luukkainen'
        }
        const shortPassword = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        await api
            .post('/api/users')
            .send(takenUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(noUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(shortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(noPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(shortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await api.get('/api/users')

        assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
