import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { createAnecdote } from '../requests'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const style = {
    marginBottom: 10
  }

  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      dispatch({ type: "ERROR", payload: error.response.data.error })
      setTimeout(() => {
        dispatch({ type: 'REMOVE' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })

    dispatch({ type: "CREATE", payload: `added '${content}'` })
    setTimeout(() => {
      dispatch({ type: 'REMOVE' })
    }, 5000)
}

  return (
    <div style={style}>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
