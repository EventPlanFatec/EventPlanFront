import React, { useState } from 'react';
import { TextField, Accordion, AccordionSummary, AccordionDetails, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqData, setFaqData] = useState([
    {
      category: 'Geral',
      question: "Quem somos nós?",
      answer: "EventPlan é um grupo de jovens que se juntaram para criar um site de planejamento de eventos. Nós queremos ajudar você a planejar o seu evento dos sonhos.",
      helpful: 0,
      nothelpful: 0
    },
    {
      category: 'Contatos',
      question: "Como posso entrar em contato com vocês?",
      answer: "Você pode nos contatar pelo nosso email.",
      helpful: 0,
      nothelpful: 0
    },
    {
      category: 'Planejamento',
      question: "Como posso planejar um evento?",
      answer: "Você pode planejar um evento clicando no botão 'Planejar Evento' na página inicial.",
      helpful: 0,
      nothelpful: 0
    },
    {
      category: 'Planejamento',
      question: "Quanto custa planejar um evento?",
      answer: "O custo de planejar um evento depende do tipo de evento que você deseja planejar. Você pode ver os preços na página de planejamento de eventos.",
      helpful: 0,
      nothelpful: 0
    },
    {
      category: 'Planejamento',
      question: "Como posso cancelar um evento?",
      answer: "Você pode cancelar um evento clicando no botão 'Cancelar Evento' na página de planejamento de eventos.",
      helpful: 0,
      nothelpful: 0
    }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredFaqs = faqData.filter(faq => 
    (faq.category === selectedCategory || selectedCategory === 'all') &&
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFeedback = (index, type) => {
    const updatedFaqs = [...faqData];
    if (type === 'helpful') {
      updatedFaqs[index].helpful += 1;
    } else {
      updatedFaqs[index].nothelpful += 1;
    }
    setFaqData(updatedFaqs);
  };

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" sx={{ fontWeight: 'bold' }}>Central de Ajuda</Typography>

      <Box sx={{ marginTop: 2, marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Filtrar por Categoria</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Filtrar por Categoria"
          >
            <MenuItem value="all">Todas as Categorias</MenuItem>
            <MenuItem value="Geral">Geral</MenuItem>
            <MenuItem value="Contatos">Contatos</MenuItem>
            <MenuItem value="Planejamento">Planejamento</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Pesquisar"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />

      {filteredFaqs.map((faq, index) => (
        <Accordion key={index} className={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleFeedback(index, 'helpful')}
              >
                Útil
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleFeedback(index, 'nothelpful')}
                sx={{ marginLeft: 1 }}
              >
                Não Útil
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
