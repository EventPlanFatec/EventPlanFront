import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
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
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // Importa Firebase Auth
import { db } from "../firebase/config";  // Supondo que você tenha o Firebase configurado
import { collection, getDocs, query, where } from "firebase/firestore";  // Importa Firebase Firestore
import Logo from "../assets/Logo.svg";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userType, setUserType] = useState(null);  // Estado para tipo de usuário
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Função para buscar o tipo de usuário no Firebase (ajustada para coleções específicas)
  const fetchUserType = async (email) => {
    let userType = null;

    // Verificar se o usuário está na coleção "organizacao"
    const orgRef = collection(db, "organizacao");
    const orgQuery = query(orgRef, where("email", "==", email));
    const orgSnapshot = await getDocs(orgQuery);
    if (!orgSnapshot.empty) {
      userType = "Organizacao"; // Se encontrado, é um tipo 'Organizacao'
    } else {
      // Verificar se o usuário está na coleção "usuariosadm"
      const adminRef = collection(db, "usuariosadm");
      const adminQuery = query(adminRef, where("email", "==", email));
      const adminSnapshot = await getDocs(adminQuery);
      if (!adminSnapshot.empty) {
        userType = "UsuarioAdm"; // Se encontrado, é um tipo 'UsuarioAdm'
      } else {
        // Se não encontrado em "usuariosadm", verificar em "usuarios"
        const userRef = collection(db, "usuarios");
        const userQuery = query(userRef, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          userType = "UsuarioFinal"; // Se encontrado, é um tipo 'UsuarioFinal'
        }
      }
    }

    setUserType(userType); // Atualiza o estado do tipo de usuário
  };

  // UseEffect para verificar se o usuário está logado
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchUserType(user.email); // Chama a função para buscar o tipo do usuário no Firestore
      } else {
        setIsLoggedIn(false);
        setUserType(null); // Se não houver usuário logado, reseta o tipo
      }
    });
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Função de busca para eventos
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Aqui você pode adicionar a lógica para filtrar eventos com base no `searchQuery`
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
      { text: "Gerenciar Eventos", icon: faBox, path: "/manage-events" } // Link para Gerenciar Eventos
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

          <Box className={styles.searchContainer}>
            <TextField
              variant="outlined"
              placeholder="Pesquisar eventos..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ backgroundColor: "white", borderRadius: "4px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faSearch} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className={styles.rightItems}>
            <NavLink to={isLoggedIn ? "/profile" : "/login"}>
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
