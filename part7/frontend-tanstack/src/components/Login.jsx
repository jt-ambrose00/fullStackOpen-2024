import { useReducer } from 'react'

import { Box, Button, TextField } from '@mui/material'

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

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Box>
          <TextField
            label='Username'
            variant='outlined'
            style={{ marginBottom: 10 }}
            size='small'
            fullWidth
            data-testid='username'
            value={loginState.username}
            onChange={(e) => loginDispatch({
              type: 'SET_USERNAME', payload: e.target.value
            })}
          />
        </Box>
        <Box>
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            style={{ marginBottom: 10 }}
            size='small'
            fullWidth
            data-testid='password'
            value={loginState.password}
            onChange={(e) => loginDispatch({
              type: 'SET_PASSWORD', payload: e.target.value
            })}
          />
        </Box>
        <Box>
          <Button
            variant='contained'
            color='primary'
            size='small'
            type='submit'
          >
            Login
          </Button>
        </Box>
      </form>
    </>
  )
}

export default Login
