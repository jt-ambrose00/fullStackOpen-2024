import React from 'react'
import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow 
} from '@mui/material'

const Users = ({ allUsers }) => {
  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Blogs posted</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {allUsers.data.map(user =>(
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>
                {user.blogs.length}
              </TableCell>
            </TableRow>
          ))} 
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
