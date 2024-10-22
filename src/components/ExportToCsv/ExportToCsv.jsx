import React from 'react';
import { CSVLink } from 'react-csv';
import { Button, Box } from '@mui/material';

const ExportToCSV = ({ eventData, averageRating }) => {
  const headers = [
    { label: "Nome do Evento", key: "nome" },
    { label: "Data", key: "data" },
    { label: "Descrição", key: "descricao" },
    { label: "Localização", key: "local" },
    { label: "Banner", key: "imgBanner" },
    { label: "Avaliação Média", key: "mediaAvaliacao" },
  ];

  const data = [{
    nome: eventData.nome,
    data: eventData.data,
    descricao: eventData.descricao,
    local: eventData.local,
    imgBanner: eventData.imgBanner,
    mediaAvaliacao: averageRating.toFixed(1),
  }];

  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        marginY: '2vh',
      }}
    >
      <CSVLink data={data} headers={headers} filename={"eventos.csv"}>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{
            width: '100%',
            maxWidth: '250px',
            padding: '12px',
            textTransform: 'none',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            borderRadius: 1,
          }}
        >
          Exportar para CSV
        </Button>
      </CSVLink>
    </Box>
  );
};

export default ExportToCSV;
