import { useState } from 'react'

const BlogForm = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    props.createBlog({
      title, author, url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
        title:
      <input
        type="text"
        value={title}
        placeholder="title"
        onChange={({ target }) => setTitle(target.value)}
      />
      <br />
        author:
      <input
        type="text"
        value={author}
        placeholder="author"
        onChange={({ target }) => setAuthor(target.value)}
      />
      <br />
        url:
      <input
        type="text"
        value={url}
        placeholder="url"
        onChange={({ target }) => setUrl(target.value)}
      />
      <br />
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm
