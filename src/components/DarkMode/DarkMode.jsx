import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <Tooltip title="Alternar Modo Escuro" arrow>
            <IconButton onClick={toggleDarkMode} color="inherit">
                <FontAwesomeIcon icon={faCircleHalfStroke} />
            </IconButton>
        </Tooltip>
    );
};

export default DarkModeToggle;
