export const searchTerm = (term) => {
    return {
        type: 'FILTER_RESULTS',
        payload: term
    }
}

const reducer = (state = '', action) => {
    // console.log('state now:', state)
    // console.log('action:', action)
    switch (action.type) {
        case 'FILTER_RESULTS':
            return action.payload
        default: return state
    }
}

export default reducer
