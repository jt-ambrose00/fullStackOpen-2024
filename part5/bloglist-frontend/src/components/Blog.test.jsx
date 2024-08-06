import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog title and author, but not url and likes', () => {
  const blog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: {
        username: 'root',
        name: 'superuser'
    }
  }

  const currentUser = {
    username: 'root',
    name: 'superuser'
  }

  const { container } = render(<Blog blog={blog} currentUser={currentUser} />)
  const initialElement = container.querySelector('.initialBlogInfo')

  expect(initialElement).toHaveTextContent('Type wars')
  expect(initialElement).toHaveTextContent('Robert C. Martin')
  expect(container).not.toHaveTextContent('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
  expect(container).not.toHaveTextContent('likes: 2')
})
