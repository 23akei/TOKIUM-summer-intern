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
    <>
    {users.map(user => (
      <div style={{display: "flex", justifyContent: "space-around", border:"1px solid"}}>
        <div>id:{user.id}</div>
        <div>name:{user.name}</div>
        <div>role:{user.role}</div>
      </div>
    ))}
    </>
  )
}
