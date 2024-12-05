import React, { useState } from "react";
import { InputBase, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Estado para a pesquisa
  const navigate = useNavigate(); // Hook do React Router para navegação

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // Redireciona para a página de resultados com os critérios de pesquisa na URL
      navigate(`/eventos-encontrados?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      <InputBase
        placeholder="Buscar por Nome, Localização ou Palavras-chave..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          backgroundColor: "#fff",
          padding: "5px",
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
