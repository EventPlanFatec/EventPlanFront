import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/Logo.svg";
import { NavLink } from "react-router-dom";
import { Container, Grid, Typography } from "@mui/material";
import styles from "./Footer.module.css";

const Footer = () => {
  const iconSize = "1.75rem";

  return (
    <footer className={styles.footerCustom}>
      <Container maxWidth="lg" className={styles.container}>
        <Grid container spacing={4}>
          <Grid item md={4} xs={12}>
            <ul className={styles.list}>
              <li>
                <NavLink to="/about" className={styles.link}>
                  <Typography variant="h6" className={styles.title}>Sobre</Typography>
                </NavLink>
              </li>
              <li>
                <Typography className={styles.description}>
                  Nosso site EventPlan surgiu de um trabalho transdisciplinar, elaborado por estudantes da Fatec Luiz Marchesan.
                </Typography>
              </li>
            </ul>
          </Grid>
          <Grid item md={4} xs={12} className={styles.center}>
            <ul className={styles.logoContainer}>
              <li>
                <NavLink to="/home">
                  <img src={Logo} alt="Logo" className={styles.logo} />
                </NavLink>
              </li>
              <li>
                <Typography className={styles.contact}>Contatos</Typography>
              </li>
              <li className={styles.icons}>
                <NavLink to="/Facebook" className={styles.link}>
                  <FontAwesomeIcon icon={faFacebook} style={{ fontSize: iconSize }} />
                </NavLink>
                <NavLink to="/Instagram" className={styles.link}>
                  <FontAwesomeIcon icon={faInstagram} style={{ fontSize: iconSize }} />
                </NavLink>
                <NavLink to="/Whatsapp" className={styles.link}>
                  <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: iconSize }} />
                </NavLink>
                <NavLink to="/Email" className={styles.link}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: iconSize }} />
                </NavLink>
              </li>
            </ul>
          </Grid>
          <Grid item md={4} xs={12}>
            <ul className={styles.list}>
              <li>
                <NavLink to="/FAQ" className={styles.help}>
                  Ajuda
                </NavLink>
                <li>
                  <Typography className={styles.helpItem}>Central de ajuda</Typography>
                  <Typography className={styles.helpItem}>Compradores e participantes</Typography>
                  <Typography className={styles.helpItem}>Produtores de eventos</Typography>
                </li>
              </li>
            </ul>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" className={styles.copyRight}>
          © {new Date().getFullYear()} EventPlan. Todos os direitos reservados.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;
