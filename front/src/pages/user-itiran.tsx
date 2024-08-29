import {useEffect, useState} from "react"
import { api } from "../const"
import { User } from "../../openapi/api"
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function UserItiran() {
  const [users, setUsers] = useState<User[]>([])

  const fetchAllUsers = async () => {
    const res = await api.users.getUsers()
    if (res.data) {
      setUsers(res.data)
    }
  }
  
  useEffect(()=>{
    fetchAllUsers()
  }, [])
  
  return (
    <>
    <Typography variant="h6">ユーザー一覧</Typography>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#c9c9c9', color: 'white' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </>
  )
}
