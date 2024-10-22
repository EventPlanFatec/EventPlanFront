import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faInfoCircle, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.svg";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleAvatarClick = () => {
    if (user) {
      return;
    } 
  };

  const navLinks = [
    { text: "Início", icon: faHome, path: "/" },
    { text: "Eventos", icon: faCalendarAlt, path: "/event" },
    { text: "Sobre", icon: faInfoCircle, path: "/about" },
  ];

  return (
    <>
      <AppBar position="sticky" className={styles.fixedTop} style={{ backgroundColor: "#0d0013" }}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.menuContainer}>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} className={styles.hamburgerIcon}>
              <FontAwesomeIcon icon={faBars} style={{ color: "white" }} />
            </IconButton>
            <span className={styles.menuText} onClick={toggleDrawer(true)} style={{ color: "white", fontWeight: "bold" }}>
              Menu
            </span>
          </Box>

          <NavLink to="/" className={styles.logoContainer}>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </NavLink>

          <Box className={styles.rightItems}>
            <Box
              className={styles.profileContainer}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <img
                src="https://s3.glbimg.com/v1/AUTH_a468dd4e265e4c40b714860137150800/sales-vitrine-web/sales-vitrine-web/assets/images/icons/user-icon.svg"
                alt="Avatar do Usuário"
                className={styles.avatar}
                onClick={handleAvatarClick}
              />
              {hovered && (
                <Box className={styles.profileHover}>
                  <strong className={styles.eventPlanTitle}>EventPlan</strong>
                  <p className={styles.eventPlanDescription}>
                    Garanta seu ingresso para os melhores eventos no EventPlan!
                  </p>
                  {user ? (
                    <NavLink to="/profile">
                      <Button variant="contained" color="primary" className={styles.profileButton}>
                        Meu Perfil
                      </Button>
                    </NavLink>
                  ) : (
                    <NavLink to="/login">
                      <Button variant="contained" color="primary" className={styles.profileButton}>
                        Entrar
                      </Button>
                    </NavLink>
                  )}
                </Box>
              )}
            </Box>
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
