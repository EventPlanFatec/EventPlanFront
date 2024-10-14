import React from 'react';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <IconButton onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
            <FontAwesomeIcon icon={faCircleHalfStroke} />
        </IconButton>
    );
};

export default DarkModeToggle;
