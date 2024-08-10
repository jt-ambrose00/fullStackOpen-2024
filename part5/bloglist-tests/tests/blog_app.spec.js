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
})
