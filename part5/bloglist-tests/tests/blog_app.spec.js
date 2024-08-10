const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginButton = await page.getByRole('button', { name: 'login' })
    const usernameInput = await page.getByText('username')
    const passwordInput = await page.getByText('password')

    await expect(loginButton).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
        await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('cinnamon')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('invalid username or password'))
            .toBeVisible()
        await expect(page.getByText('Matti Luukkainen logged-in'))
            .not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByTestId('title').fill('e2e title')
        await page.getByTestId('author').fill('e2e author')
        await page.getByTestId('url').fill('www.e2e.com')
        await page.getByRole('button', { name: 'save' }).click()

        await expect(page.locator('.initialBlogInfo'))
            .toContainText('e2e title by e2e author')
        await expect(page.getByRole('button', { name: 'view' }))
            .toBeVisible()
    })
  })

  describe('When logged in and blog added', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'create' }).click()
        await page.getByTestId('title').fill('e2e title')
        await page.getByTestId('author').fill('e2e author')
        await page.getByTestId('url').fill('www.e2e.com')
        await page.getByRole('button', { name: 'save' }).click()
    })

    test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.locator('.likes'))
            .toContainText('likes: 1')
    })
  })
})
