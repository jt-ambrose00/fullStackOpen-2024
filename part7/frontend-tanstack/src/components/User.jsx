import { Divider, List, ListItem } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'

const User = ({ allUsers }) => {
  const id = useParams().id
  const user = allUsers.data.find(u => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h3>{user.name}'s blogs</h3>
      {user.blogs.map(blog =>
        <List key={blog.id}>
          <ListItem>{blog.title}</ListItem>
          <Divider />
        </List>
      )}
    </div>
  )
}

export default User
