import {useEffect, useState} from "react"
import { api } from "../const"
import { User } from "../../openapi/api"

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
    <div style={{display:"flex", justifyContent: "center"}}>
      <table border={1} cellPadding={5}>
      <thead>
      <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Role</th>
      </tr>
      </thead>
      <tbody>
      {users.map(user => (
        <tr>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.role}</td>
        </tr>
    ))}
      </tbody>
    </table>
    </div>
  )
}
