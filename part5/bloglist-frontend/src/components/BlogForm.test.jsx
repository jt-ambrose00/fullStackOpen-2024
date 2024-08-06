import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm /> tests', () => {
  test('calls event handler prop with correct details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const saveButton = screen.getByText('save')

    await user.type(titleInput, 'blog title...')
    await user.type(authorInput, 'blog author...')
    await user.type(urlInput, 'blog url...')
    await user.click(saveButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('blog title...')
    expect(createBlog.mock.calls[0][0].author).toBe('blog author...')
    expect(createBlog.mock.calls[0][0].url).toBe('blog url...')
  })
})
