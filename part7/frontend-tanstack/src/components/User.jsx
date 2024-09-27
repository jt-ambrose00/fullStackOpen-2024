import React from 'react'
import { useParams } from 'react-router-dom'

import { Box, Divider, List, ListItem } from '@mui/material'

const User = ({ allUsers }) => {
  const id = useParams().id
  const user = allUsers.data.find(u => u.id === id)

  if (!user) {
    return null
  }

  return (
    <>
      <h2>{user.name}'s blogs</h2>
      <List>
        {user.blogs.map(blog =>
          <Box key={blog.id}>
            <ListItem sx={{ padding: '1em' }}>{blog.title}</ListItem>
            <Divider />
          </Box>
        )}
      </List>
    </>
  )
}

export default User
