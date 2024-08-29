import { useState, useContext } from "react"
import {api} from "../const"
import { Context } from "../Context.tsx"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { UserRoleSelector } from "../components/user-role-selector.tsx";

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
              required={true}
              margin="normal"
            />
            <UserRoleSelector
              label="役職"
              value={role}
              updateText={(text) => setRole(text)}
              fullWidth
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
      </>
  )
}
