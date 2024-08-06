import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe } from 'vitest'
import Blog from './Blog'

describe('<Blog /> tests', () => {
  let blog
  let currentUser

  beforeEach(() => {
    blog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: {
        username: 'root',
        name: 'superuser'
      }
    }

    currentUser = {
      username: 'root',
      name: 'superuser'
    }
  })

  test('renders blog title and author, but not url and likes', () => {
    const { container } = render(<Blog blog={blog} currentUser={currentUser} />)
    const initialElement = container.querySelector('.initialBlogInfo')

    expect(initialElement).toHaveTextContent('Type wars')
    expect(initialElement).toHaveTextContent('Robert C. Martin')
    expect(container).not.toHaveTextContent('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
    expect(container).not.toHaveTextContent('likes: 2')
  })

  test('clicking the button shows the url and likes', async () => {
    const { container } = render(<Blog blog={blog} currentUser={currentUser} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')

    expect(url).toHaveTextContent('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
    expect(likes).toHaveTextContent('likes: 2')
  })

  test('clicking like button twice registers two clicks', async () => {
    const addLike = vi.fn()
    const { container } = render(
      <Blog blog={blog} currentUser={currentUser} updateLikes={addLike} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(addLike.mock.calls).toHaveLength(2)
  })
})
