import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { getDocs, setDoc, doc, collection } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton, List, ListItem, ListItemText, Tooltip, Typography, Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

const FavoriteEvents = ({ userId, eventId, eventName }) => {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();

    const fetchFavorites = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${userId}/favorites`));
            const favoriteData = querySnapshot.docs.map(doc => doc.data());
            setFavorites(favoriteData);
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const handleFavorite = async () => {
        if (!user) {
            console.error("Usuário não autenticado.");
            return;
        }

        try {
            await setDoc(doc(db, `users/${user.uid}/favorites/${eventId}`), { eventId, eventName });
            fetchFavorites();
            toast.success("Evento adicionado aos favoritos!");
        } catch (error) {
            console.error("Falha ao adicionar evento como Favorito.", error);
            toast.error("Falha ao adicionar evento como Favorito.");
        }
    };

    return (
        <div>
            <Typography variant="h5">Favoritos</Typography>
            <List>
                {favorites.map((favorite, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={favorite.eventName} />
                    </ListItem>
                ))}
            </List>
            <Tooltip title="Adicionar aos Favoritos">
                <IconButton onClick={handleFavorite} color="primary">
                    <FavoriteIcon />
                </IconButton>
            </Tooltip>
            <ToastContainer />
        </div>
    );
};

export default FavoriteEvents;
