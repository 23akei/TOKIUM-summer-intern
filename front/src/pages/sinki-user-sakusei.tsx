import { useState, useContext } from "react"
import {api} from "../const"
import { Context } from "../Context.tsx"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

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
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            新規ユーザー作成画面
          </Typography>
          <Box mt={2}>
            <TextField
              label="名前"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="役職"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
          <Box mt={4}>
            <Button
              variant="contained"
              onClick={registerUser}
            >
              作成
            </Button>
          </Box>
        </Box>
      </Container>


      {/* <div>
      <p>新規ユーザー作成画面</p>
      <p>名前</p>
      <input value={name} onChange={(event)=>{setName(event.target.value)}}></input>
      <p>役職</p>
      <input value={role} onChange={(event)=>{setRole(event.target.value)}}></input>

      <div>
      <button onClick={registerUser}>作成</button>
      </div>
      
      </div> */}
      </>
  )
}
