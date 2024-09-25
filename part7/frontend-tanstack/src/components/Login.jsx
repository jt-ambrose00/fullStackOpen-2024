import { useReducer } from 'react'
import { Button, styled, TextField } from '@mui/material'

import loginReducer, { initialState } from '../reducers/LoginReducer'

const Login = ({ doLogin }) => {
  const [loginState, loginDispatch] = useReducer(loginReducer, initialState)

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({
      username: loginState.username,
      password: loginState.password
    })
    loginDispatch({ type: 'RESET' })
  }

  const style = {
    marginBottom: 10
  }

  return (
    <>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label='Username'
            variant='outlined'
            data-testid='username'
            style={style}
            value={loginState.username}
            onChange={(e) => loginDispatch({
              type: 'SET_USERNAME', payload: e.target.value
            })}
          />
        </div>
        <div>
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            data-testid='password'
            style={style}
            value={loginState.password}
            onChange={(e) => loginDispatch({
              type: 'SET_PASSWORD', payload: e.target.value
            })}
          />
        </div>
        <div>
          <Button variant='contained' color='primary' type='submit'>
            Login
          </Button>
        </div>
      </form>
    </>
  )
}

export default Login
