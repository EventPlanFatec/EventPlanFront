import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from '@mui/material';

const ExportToCSV = ({ eventData, averageRating }) => {
  const headers = [
    { label: "Event Name", key: "nome" },
    { label: "Date", key: "data" },
    { label: "Description", key: "descricao" },
    { label: "Location", key: "local" },
    { label: "Banner", key: "imgBanner" },
    { label: "Average Rating", key: "mediaAvaliacao" },
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
    <CSVLink data={data} headers={headers} filename={"eventos.csv"}>
      <Button variant="contained" color="primary">
        Exportar para CSV
      </Button>
    </CSVLink>
  );
};

export default ExportToCSV;
