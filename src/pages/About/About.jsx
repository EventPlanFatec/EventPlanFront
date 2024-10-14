import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rhian from "../../assets/rhian.jpeg";
import Cleston from "../../assets/Cleston.jpeg";
import Felipe from "../../assets/Felipe.jpeg";
import Pedro from "../../assets/Pedro.jpeg";
import './About.module.css';

const About = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Sobre
      </Typography>
      <Typography variant="body1" paragraph>
        Somos estudantes da Fatec Matão, desenvolvendo o trabalho interdisciplinar do curso de DSM. Temos a intenção de aumentar nossos conhecimentos com este trabalho, visando evoluir e aprender mais sobre a área.
        Nossa plataforma tem em vista ser intuitiva, com acesso seguro nas transações efetuadas dentro do site, facilitar a venda de ingressos para os eventos em nossa região, além de ser compatível com a maioria dos dispositivos.
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        {[
          { nome: "Rhian Mendes Souza", img: rhian },
          { nome: "Cleston Kenji Maruyama Tonooka", img: Cleston },
          { nome: "Felipe Salgaço Moretti", img: Felipe },
          { nome: "Pedro Henrique Biondi de Carvalho", img: Pedro },
        ].map((membro, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} textAlign="center">
            <Paper elevation={3} sx={{ padding: 1 }}>
              <img src={membro.img} alt={`foto do membro do grupo ${membro.nome}`} className="foto-sobre" />
              <Typography variant="subtitle1">{membro.nome}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default About;
