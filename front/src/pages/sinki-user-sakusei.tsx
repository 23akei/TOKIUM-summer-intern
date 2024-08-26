import { useState, useContext } from "react"
import {api} from "../const"
import { Context } from "../Context.tsx"

export default function SinkiUserSakusei() {

  const {setUserID} = useContext(Context);
  
  const [name, setName] = useState("");

  const [role, setRole] = useState("");

  const registerUser = async () => {
    const res = await api.users.createUser({name, role})
    console.log(res.data)
    if (!res.data || !res.data.id) {
      alert((res.error.message))
    }

    alert("id is " + res.data.id + " name is " + res.data.name)
    setUserID(res.data.id)
  }

  return (
    <>
      <div>
      <p>新規ユーザー作成画面</p>
      <p>名前</p>
      <input value={name} onChange={(event)=>{setName(event.target.value)}}></input>
      <p>役職</p>
      <input value={role} onChange={(event)=>{setRole(event.target.value)}}></input>

      <div>
      <button onClick={registerUser}>作成</button>
      </div>
      
      </div>
      </>
  )
}
