import React, { useState } from "react";
import { IntlProvider, FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './LanguageSelector.module.css';
import { Select, MenuItem, Typography, FormControl, InputLabel } from '@mui/material';

const LanguageSelector = () => {
    const [locale, setLocale] = useState('pt');

    const handleChangeLanguage = (event) => {
        setLocale(event.target.value);
    }

    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <div className={styles.container}>
                <FormControl fullWidth variant="outlined" className={styles.select}>
                    <InputLabel id="language-select-label">Idioma</InputLabel>
                    <Select
                        labelId="language-select-label"
                        value={locale}
                        onChange={handleChangeLanguage}
                        label="Idioma"
                    >
                        <MenuItem value="pt">Português</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    <FormattedMessage id="saudações" defaultMessage="Bem-vindo ao site EventPlan" />
                </Typography>
            </div>
        </IntlProvider>
    )
}

export default LanguageSelector;
