import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faHome, faInfoCircle, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import LanguageSelector from "./Traducao/LanguageSelector";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkMode/DarkMode";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <List>
      <NavLink to="/" onClick={toggleDrawer(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItem button>
          <ListItemIcon>
            <FontAwesomeIcon icon={faHome} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </NavLink>
      <NavLink to="/about" onClick={toggleDrawer(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItem button>
          <ListItemIcon>
            <FontAwesomeIcon icon={faInfoCircle} />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </NavLink>
      <NavLink to="/event" onClick={toggleDrawer(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItem button>
          <ListItemIcon>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </ListItemIcon>
          <ListItemText primary="Eventos" />
        </ListItem>
      </NavLink>
    </List>
  );

  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: '#0d0013' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
          <div style={{ flexGrow: 1 }} />
          <DarkModeToggle />
          <LanguageSelector />
          <NavLink to={user ? "/profile" : "/login"}>
            <IconButton color="inherit">
              <FontAwesomeIcon icon={faUser} />
            </IconButton>
          </NavLink>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
};

export default Navbar;
