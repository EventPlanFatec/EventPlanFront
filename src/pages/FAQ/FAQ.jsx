import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, TextField, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqData, setFaqData] = useState([
    {
      question: "Quem somos nós?",
      answer: "EventPlan é um grupo de jovens que se juntaram para criar um site de planejamento de eventos. Nós queremos ajudar você a planejar o seu evento dos sonhos.",
      helpful: 0,
      nothelpful: 0
    },
    {
      question: "Como posso entrar em contato com vocês?",
      answer: "Você pode nos contatar pelo nosso email",
      helpful: 0,
      nothelpful: 0
    },
    {
      question: "Como posso planejar um evento?",
      answer: "Você pode planejar um evento clicando no botão 'Planejar Evento' na página inicial",
      helpful: 0,
      nothelpful: 0
    },
    {
      question: "Quanto custa planejar um evento?",
      answer: "O custo de planejar um evento depende do tipo de evento que você deseja planejar. Você pode ver os preços na página de planejamento de eventos",
      helpful: 0,
      nothelpful: 0
    },
    {
      question: "Como posso cancelar um evento?",
      answer: "Você pode cancelar um evento clicando no botão 'Cancelar Evento' na página de planejamento de eventos",
      helpful: 0,
      nothelpful: 0
    }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFeedback = (index, type) => {
    const updateFaqs = [...faqData];
    if (type === 'helpful') {
      updateFaqs[index].helpful += 1;
    } else {
      updateFaqs[index].nothelpful += 1;
    }
    setFaqData(updateFaqs);
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>Perguntas Frequentes</Typography>
      <TextField
        variant="outlined"
        placeholder="Pesquisar"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.search}
      />
      <Accordion defaultExpanded>
        {filteredFaqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
              <Box className={styles.feedbackButtons}>
                <Button variant="contained" color="success" size="small" onClick={() => handleFeedback(index, 'helpful')}>
                  Útil ({faq.helpful})
                </Button>
                <Button variant="contained" color="error" size="small" onClick={() => handleFeedback(index, 'nothelpful')}>
                  Não útil ({faq.nothelpful})
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Accordion>
    </Box>
  );
}

export default FAQ;
