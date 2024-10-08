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
    const loginButton = page.getByRole('button', { name: 'login' })
    const usernameInput = page.getByText('username')
    const passwordInput = page.getByText('password')

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

    test('blog can be deleted by user who added it', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.message())
                .toContain('remove e2e title by e2e author?')
            await dialog.accept()
        })

        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.locator('.initialBlogInfo'))
            .not.toBeVisible()
    })

    test('remove button only visible to correct user', async ({ page, request }) => {
        await request.post('http://localhost:5173/api/users', {
            data: {
              username: 'steven',
              name: 'Ron Stevens',
              password: 'secret'
            }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByTestId('username').fill('steven')
        await page.getByTestId('password').fill('secret')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'view' }).first().click()

        await expect(page.getByRole('button', { name: 'remove' }))
            .not.toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.locator('.likes'))
            .toContainText('likes: 1')
    })
  })

  describe('User logged in, multiple blogs added', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'create' }).click()
        await page.getByTestId('title').fill('added first')
        await page.getByTestId('author').fill('first author')
        await page.getByTestId('url').fill('www.first.com')
        await page.getByRole('button', { name: 'save' }).click()

        await page.getByRole('button', { name: 'create' }).click()
        await page.getByTestId('title').fill('added second')
        await page.getByTestId('author').fill('second author')
        await page.getByTestId('url').fill('www.second.com')
        await page.getByRole('button', { name: 'save' }).click()

        await page.getByRole('button', { name: 'create' }).click()
        await page.getByTestId('title').fill('added third')
        await page.getByTestId('author').fill('third author')
        await page.getByTestId('url').fill('www.third.com')
        await page.getByRole('button', { name: 'save' }).click()
    })

    test('blogs are arranged according to likes', async ({ page }) => {
      const second = page.locator('.blogEntry')
        .filter({ hasText: 'added second by second author' })
      const third = page.locator('.blogEntry')
        .filter({ hasText: 'added third by third author' })

      await second.getByRole('button', { name: 'view' }).click()
      await third.getByRole('button', { name: 'view' }).click()

      await second.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await second.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await third.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)

      await expect(second).toContainText('likes: 2')
      await expect(third).toContainText('likes: 1')
    
      await expect(page.locator('.blogEntry')
        .first()).toContainText('added second by second author')
      await expect(page.locator('.blogEntry')
        .last()).toContainText('added first by first author')
    })
  })
})
