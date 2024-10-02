import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import rhian from "../../assets/rhian.jpeg";
import Cleston from "../../assets/Cleston.jpeg";
import Felipe from "../../assets/Felipe.jpeg";
import Pedro from "../../assets/Pedro.jpeg";
import styles from "./About.module.css";

const About = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" gutterBottom>
        Sobre
      </Typography>
      <Typography variant="body1" paragraph>
        Somos estudantes da Fatec Matão, desenvolvendo o trabalho interdisciplinar do curso de DSM. Temos a intenção de aumentar nossos conhecimentos com este trabalho, visando evoluir e aprender mais sobre a área.
        Nossa plataforma tem em vista ser intuitiva com acesso seguro nas transações efetuadas dentro do site, facilitar a venda de ingressos para os eventos em nossa região, além de ser compatível com a maioria dos dispositivos.
      </Typography>
      <Grid container spacing={4}>
        {[
          { name: "Rhian Mendes Souza", img: rhian },
          { name: "Cleston Kenji Maruyama Tonooka", img: Cleston },
          { name: "Felipe Salgaço Moretti", img: Felipe },
          { name: "Pedro Henrique Biondi de Carvalho", img: Pedro },
        ].map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} className={styles.member}>
            <img src={member.img} alt={`foto do membro do grupo ${member.name}`} className={styles.photo} />
            <Typography variant="subtitle1" align="center">{member.name}</Typography>
          </Grid>
        ))}
      </Grid>
      <NavLink to="../Home" style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary" className={styles.backButton}>
          VOLTAR
        </Button>
      </NavLink>
    </Box>
  );
};

export default About;
