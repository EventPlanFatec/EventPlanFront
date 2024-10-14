import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/Logo.svg";
import { NavLink } from "react-router-dom";
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';

const Footer = () => {
  const iconSize = "1.75rem";

  return (
    <footer style={{ background: '#0d0013', padding: '20px 0' }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Box>
              <NavLink to="/about">
                <Typography variant="h6">Sobre</Typography>
              </NavLink>
              <Typography variant="body2" style={{ marginTop: '8px' }}>
                Nosso site EventPlan surgiu de um trabalho transdisciplinar, elaborado por estudantes da Fatec Luiz Marchesan.
              </Typography>
            </Box>
          </Grid>
          <Grid item md={4} xs={12} style={{ textAlign: 'center' }}>
            <NavLink to="/home">
              <img src={Logo} alt="Logo" style={{ width: '150px', marginBottom: '10px' }} />
            </NavLink>
            <Typography variant="h6" style={{ color: '#ffffff' }}>Contatos</Typography>
            <Box>
              <IconButton component={NavLink} to="/Facebook">
                <FontAwesomeIcon icon={faFacebook} style={{ fontSize: iconSize, color: '#ffffff' }} />
              </IconButton>
              <IconButton component={NavLink} to="/Instagram">
                <FontAwesomeIcon icon={faInstagram} style={{ fontSize: iconSize, color: '#ffffff' }} />
              </IconButton>
              <IconButton component={NavLink} to="/Whatsapp">
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: iconSize, color: '#ffffff' }} />
              </IconButton>
              <IconButton component={NavLink} to="/Email">
                <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: iconSize, color: '#ffffff' }} />
              </IconButton>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box>
              <NavLink to="/FAQ">
                <Typography variant="h6" style={{ color: '#ffffff' }}>Ajuda</Typography>
              </NavLink>
              <Typography variant="body2" style={{ marginTop: '8px', color: '#ffffff' }}>
                <NavLink to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Central de ajuda</NavLink>
              </Typography>
              <Typography variant="body2" style={{ color: '#ffffff' }}>
                <NavLink to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Compradores e participantes</NavLink>
              </Typography>
              <Typography variant="body2" style={{ color: '#ffffff' }}>
                <NavLink to="#" style={{ textDecoration: 'none', color: 'inherit' }}>Produtores de eventos</NavLink>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}

export default Footer;
