import React, { useState } from "react";
import { IntlProvider, FormattedMessage } from 'react-intl';
import messages from './messages';
import { Box, Select, MenuItem, Typography } from '@mui/material';

const LanguageSelector = () => {
    const [locale, setLocale] = useState('pt');

    const handleChangeLanguage = (e) => {
        setLocale(e.target.value);
    };

    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Select value={locale} onChange={handleChangeLanguage} variant="outlined">
                    <MenuItem value="pt">Português</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                </Select>
                <Typography variant="body1" mt={2}>
                    <FormattedMessage id="saudações" defaultMessage="Bem-vindo ao site EventPlan" />
                </Typography>
            </Box>
        </IntlProvider>
    );
};

export default LanguageSelector;
