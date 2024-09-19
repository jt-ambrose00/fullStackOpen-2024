import { useSelector, useDispatch } from 'react-redux'

import { addVote } from '../reducers/anecdoteReducer'
import { notificationMessage } from '../reducers/notificationReducer'

const NewList = () => {
  const anecdotes = useSelector(state => 
    state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
  )).sort((a, b) => 
    b.votes - a.votes
  )

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(addVote(anecdote))
    dispatch(notificationMessage(`voted for '${anecdote.content}'`, 5))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default NewList
