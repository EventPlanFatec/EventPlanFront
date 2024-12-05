import React, { useState } from "react";
import { InputBase, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Estado da barra de pesquisa
  const navigate = useNavigate(); // Hook para navegação

  // Redirecionar para a página de eventos encontrados
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/eventos-encontrados?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Detectar o pressionamento da tecla Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <Box>
      <InputBase
        placeholder="Buscar por Nome, Localização ou Palavras-chave..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado
        onKeyDown={handleKeyDown} // Detecta a tecla Enter
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "5px",
          width: "80%",
        }}
      />
      <Button onClick={handleSearchSubmit} style={{ marginLeft: "10px" }}>
        Buscar
      </Button>
    </Box>
  );
};

export default SearchBar;
