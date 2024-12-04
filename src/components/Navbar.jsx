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
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faInfoCircle,
  faCalendarAlt,
  faShoppingCart,
  faBox,
  faUserShield,
  faPlusCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { usePermissions } from "../context/PermissionsContext";
import Logo from "../assets/Logo.svg";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userType } = usePermissions();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Links padrão para todos os usuários
  const navLinks = [
    { text: "Início", icon: faHome, path: "/" },
    { text: "Eventos", icon: faCalendarAlt, path: "/eventlist" },
    { text: "Sobre", icon: faInfoCircle, path: "/about" },
  ];

  // Links adicionais com base no tipo de usuário
  if (userType === "UsuarioAdm") {
    navLinks.push(
      { text: "Aceitar Organizações", icon: faUserShield, path: "/accept-organizations" },
      { text: "Gerenciar Usuários", icon: faUsers, path: "/manage-users" }
    );
  } else if (userType === "Organizacao") {
    navLinks.push(
      { text: "Criar Evento", icon: faPlusCircle, path: "/create-event" },
      { text: "Meus Eventos", icon: faBox, path: "/my-events" }
    );
  } else if (userType === "UsuarioFinal") {
    navLinks.push(
      { text: "Carrinho", icon: faShoppingCart, path: "/carrinho" },
      { text: "Meus Ingressos", icon: faBox, path: "/my-tickets" }
    );
  }

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
            <NavLink to={userType ? "/profile" : "/login"}>
              <img
                src="https://s3.glbimg.com/v1/AUTH_a468dd4e265e4c40b714860137150800/sales-vitrine-web/sales-vitrine-web/assets/images/icons/user-icon.svg"
                alt="Avatar"
                className={styles.avatar}
              />
            </NavLink>
            {userType === "UsuarioFinal" && (
              <NavLink to="/carrinho">
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: "white", fontSize: "20px", marginLeft: "16px" }} />
              </NavLink>
            )}
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