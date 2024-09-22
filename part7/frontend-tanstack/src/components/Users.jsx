import React from 'react'
import { useQuery } from '@tanstack/react-query'

import userService from '../services/users'

const Users = () => {
  const allUsers = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

  if (allUsers.isPending) {
    return <div>Loading users...</div>
  }

  if (allUsers.isError) {
    return  <div>
      User service not available due to problems in server
    </div>
  }

  // console.log(allUsers.data)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Blogs posted</th>
          </tr>
          {allUsers.data.map(user => 
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users
