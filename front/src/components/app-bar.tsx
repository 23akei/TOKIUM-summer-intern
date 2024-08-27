import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

import { useContext } from "react"
import { Context } from '../Context.tsx'

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function CustomAppBar() {
  const { userID, setUserID } = useContext(Context);

  const link: any = {
    padding: "2px", color: 'inherit', textDecoration: 'none', display: "flex", height: "100%", alignItems: "center", justifyContent:"center"
  }

  return (
    <AppBar position="static" style={{ marginBottom: "50px" }}>
      <Container maxWidth="xl">
      <Toolbar disableGutters>
      <Typography
    variant="h6"
    noWrap
    component="div"
    sx={{
      mr: 2,
      display: { xs: 'none', md: 'flex' },
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.3rem',
      color: 'inherit',
      textDecoration: 'none',
    }}
      >
      Kimochi++
    </Typography>


      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      <Button sx={{ m: 1, color: 'white', display: 'block' }}>
      <Link to="/" style={link}>Home</Link>
      </Button>

      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/sinki-user-sakusei" style={link}>新規ユーザー作成</Link>
      </Button>
      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/sinki-sinsei" style={link}>新規申請</Link>
      </Button>
      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/sinsei-teishutsu" style={link}>申請提出</Link>
      </Button>
      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/syounin" style={link}>承認</Link>
      </Button>
      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/syounin-huro" style={link}>承認フロー</Link>
      </Button>
      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/syounin-huro-itiran" style={link}>承認フロー一覧</Link>
      </Button>

      <Button sx={{ m: 1, p: 0, color: 'white', display: 'block' }}>
      <Link to="/user-itiran" style={link}>ユーザー一覧</Link>
      </Button>
      </Box>

      <Box sx={{ flexGrow: 0 }}>


      <span>user id:</span>
      <input type="number" value={userID} onChange={(event) => setUserID(event.target.valueAsNumber)} />


      </Box>
      </Toolbar>
      </Container>
      </AppBar>
  );
}
