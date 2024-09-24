export const initialState = {
  title: '',
  author: '',
  url: ''
}

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload }
    case 'SET_AUTHOR':
      return { ...state, author: action.payload }
    case 'SET_URL':
      return { ...state, url: action.payload }
    case 'SET_COMMENT':
      return action.payload
    case 'RESET':
      return initialState
    case 'RESET_COMMENT':
      return ''
    default:
      return state
  }
}

export default formReducer
