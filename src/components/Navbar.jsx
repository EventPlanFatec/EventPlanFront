import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faInfoCircle, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.svg";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { text: "Início", icon: faHome, path: "/" },
    { text: "Eventos", icon: faCalendarAlt, path: "/eventlist" },
    { text: "Sobre", icon: faInfoCircle, path: "/about" },
  ];

  return (
    <>
      <AppBar position="sticky" className={styles.fixedTop} style={{ backgroundColor: "#0d0013" }}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.menuContainer}>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} className={styles.hamburgerIcon}>
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <span className={styles.menuText} onClick={toggleDrawer(true)}>
              Menu
            </span>
          </Box>

          <NavLink to="/" className={styles.logoContainer}>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </NavLink>

          <Box className={styles.rightItems}>
            <NavLink to={user ? "/profile" : "/login"}>
              <img
                src="https://s3.glbimg.com/v1/AUTH_a468dd4e265e4c40b714860137150800/sales-vitrine-web/sales-vitrine-web/assets/images/icons/user-icon.svg"
                alt="Avatar"
                className={styles.avatar}
              />
            </NavLink>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {navLinks.map((link) => (
            <NavLink to={link.path} key={link.text} onClick={toggleDrawer(false)} className={styles.navLink}>
              <ListItem button>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FontAwesomeIcon icon={link.icon} style={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText
                  primary={link.text}
                  sx={{
                    color: "black",
                    fontWeight: 700,
                    fontSize: "16px",
                    paddingLeft: "4px",
                  }}
                />
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
