import React from 'react'
import { Link } from 'react-router-dom'

import { AppBar, Box, Button, Toolbar } from '@mui/material'

import { useUserValue } from '../reducers/UserContext'

const Navbar = ({ handleLogout }) => {
  const userValue = useUserValue()

  return (
    <AppBar position='static'>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button color='inherit' component={Link} to='/' >
            Blogs
          </Button>
          <Button color='inherit' component={Link} to='/users' >
            Users
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <em>{userValue.name} logged in</em>
          <Button color='inherit' onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
