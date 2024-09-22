import { useReducer } from 'react'

import loginReducer, { initialState } from '../reducers/LoginReducer'

const Login = ({ doLogin }) => {
  const [loginState, dispatch] = useReducer(loginReducer, initialState)

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({
      username: loginState.username,
      password: loginState.password
    })
    dispatch({ type: 'RESET' })
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          data-testid='username'
          value={loginState.username}
          onChange={(e) => dispatch({
            type: 'SET_USERNAME', payload: e.target.value
          })} 
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={loginState.password}
          data-testid='password'
          onChange={(e) => dispatch({
            type: 'SET_PASSWORD', payload: e.target.value
          })} 
        />
      </label>
      <br />
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login
