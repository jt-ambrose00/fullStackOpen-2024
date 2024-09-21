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
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default formReducer
