import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { Link } from 'react-router-dom';

import { useContext, useEffect, useState } from "react"
import { Context } from '../Context.tsx'

import { api } from '../const.ts'
import { User } from "../../openapi/api.ts"
import { TextField } from '@mui/material';

const StyledButton = styled(Button)`
  padding: 0px;
  color: white;
  margin: 2px;
  display: block:
  height: 90%;
`;

const StyledBox = styled(Box)`
 flexGrow: 1;
 display: flex;
`;

const StyledUserBox = styled(Box)`
 flex-grow: 2;
 display: right;
 height: 90%;
`;

const StyledAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-inputRoot: {
    text-color: 'white';
  },
  .MuiAutocomplete-option: {
    color: 'white';
  }
  height: 80%;
`;

const StyledLink = styled(Link)`
  padding: 4px;
  color: inherit;
  text-decoration: none;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export default function CustomAppBar() {
  const { userID, setUserID } = useContext(Context);
  const [users, setUsers] = useState<User[]>([]);

  const getAllUsers = async () => {
    const response = await api.users.getUsers()
    if (response.data) {
      setUsers(response.data);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  const menuLink = [
    { "link": "/", "label": "Home" },
    { "link": "/sinki-user-sakusei", "label": "新規ユーザー作成" },
    { "link": "/sinki-sinsei", "label": "新規申請" },
    { "link": "/sinsei-teishutsu", "label": "申請提出" },
    { "link": "/syounin", "label": "承認" },
    { "link": "/syounin-huro", "label": "承認フロー" },
    { "link": "/user-itiran", "label": "ユーザー一覧" },
  ];

  return (
    <AppBar position="static" sx={{ marginBottom: "50px" }}>
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

          <StyledBox>
            {menuLink.map((item) => (
              <StyledButton key={item.link}>
                <StyledLink to={item.link}>{item.label}</StyledLink>
              </StyledButton>
            ))}
          </StyledBox>

          <StyledUserBox>
            <StyledAutocomplete
              options={users}
              getOptionLabel={(user) => user.name as string}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="ユーザ選択"
                />
              )}
              onChange={(_, value) => {
                if (value) {
                  setUserID(value.id);
                } else {
                  setUserID('');
                }
              }}
              value={users.find((user) => user.id === userID) || null}
            />
          </StyledUserBox>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
