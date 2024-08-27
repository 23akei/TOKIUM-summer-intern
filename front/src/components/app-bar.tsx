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
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
    
      <AppBar position="static" style={{marginBottom: "50px"}}>
        <Container  maxWidth="xl">
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

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                    display: { xs: 'block', md: 'none' },
                    }}
                >
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/">Home</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/sinki-user-sakusei">新規ユーザー作成</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/sinki-sinsei">新規申請</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/sinsei-teishutsu">申請提出</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/syounin">承認</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/syounin-huro">承認フロー</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/user-itiran">ユーザー一覧</Link>
                    </MenuItem>
                </Menu>
            </Box>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            </Button>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/sinki-user-sakusei" style={{ color: 'inherit', textDecoration: 'none' }}>新規ユーザー作成</Link>
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/sinki-sinsei" style={{ color: 'inherit', textDecoration: 'none' }}>新規申請</Link>
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/sinsei-teishutsu" style={{ color: 'inherit', textDecoration: 'none' }}>申請提出</Link>
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/syounin" style={{ color: 'inherit', textDecoration: 'none' }}>承認</Link>
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/syounin-huro" style={{ color: 'inherit', textDecoration: 'none' }}>承認フロー</Link>
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link to="/user-itiran" style={{ color: 'inherit', textDecoration: 'none' }}>ユーザー一覧</Link>
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
