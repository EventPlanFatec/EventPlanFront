import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { getDocs, setDoc, deleteDoc, doc, collection } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton, List, ListItemText, Tooltip, Typography, Box, Card, CardContent, Container } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const FavoriteEvents = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();

    // Fetch the user's favorite events from Firestore
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

    // Add or remove event from favorites
    const handleFavorite = async (eventId, eventName) => {
        if (!user) {
            console.error("Usuário não autenticado.");
            return;
        }

        const isFavorited = favorites.some(fav => fav.eventId === eventId);

        try {
            if (isFavorited) {
                // Remove from favorites
                await deleteDoc(doc(db, `users/${user.uid}/favorites/${eventId}`));
                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.eventId !== eventId));
                toast.success("Evento removido dos favoritos!");
            } else {
                // Add to favorites
                await setDoc(doc(db, `users/${user.uid}/favorites/${eventId}`), { eventId, eventName });
                setFavorites(prevFavorites => [...prevFavorites, { eventId, eventName }]);
                toast.success("Evento adicionado aos favoritos!");
            }
        } catch (error) {
            console.error("Falha ao atualizar favoritos.", error);
            toast.error("Falha ao atualizar favoritos.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 2, boxShadow: 3, margin: '0 auto' }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: '#333' }}>
                Meus Favoritos
            </Typography>
            <Box sx={{ width: '100%', marginBottom: 3 }}>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {favorites.map((favorite, index) => (
                        <Card key={index} sx={{ display: 'flex', alignItems: 'center', boxShadow: 3, borderRadius: '8px' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ListItemText
                                    primary={favorite.eventName}
                                    sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#333' }}
                                />
                                <Tooltip title="Remover dos Favoritos">
                                    <IconButton
                                        onClick={() => handleFavorite(favorite.eventId, favorite.eventName)}
                                        color="error"
                                        sx={{
                                            fontSize: '1.5rem',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.2)',
                                            },
                                        }}
                                    >
                                        <FavoriteIcon sx={{ fontSize: 'inherit' }} />
                                    </IconButton>
                                </Tooltip>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <Tooltip title="Adicionar aos Favoritos">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 1,
                            border: '2px solid #ff4081',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            cursor: 'pointer',
                            backgroundColor: '#ff4081',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                transition: '0.3s',
                                backgroundColor: '#d81b60',
                            },
                        }}
                    >
                        <IconButton
                            onClick={() => handleFavorite(eventId, eventName)}
                            sx={{
                                fontSize: '2rem',
                                color: '#fff',
                                '&:hover': {
                                    color: '#fff',
                                },
                            }}
                        >
                            <FavoriteBorderIcon />
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default FavoriteEvents;
