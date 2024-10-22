import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config';
import { Container, Typography, TextField, Button, Box, Card, CardContent } from '@mui/material';

const EventRating = ({ eventId }) => {
    const [ratings, setRatings] = useState([]);
    const [newRating, setNewRating] = useState(0);
    const [comment, setComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ratingsCollection = collection(db, `Eventos/${eventId}/ratings`);
                const snapshot = await getDocs(ratingsCollection);
                const fetchedRatings = snapshot.docs.map(doc => doc.data());
                setRatings(fetchedRatings);
                calculateAverageRating(fetchedRatings);
            } catch (error) {
                console.error('Erro ao buscar avaliações: ', error);
            }
        };

        fetchData();
    }, [eventId]);

    const handleRatingSubmit = async () => {
        if (newRating < 0 || newRating > 5) {
            alert("A nota deve estar entre 0 e 5.");
            return;
        }

        try {
            const ratingsCollection = collection(db, `Eventos/${eventId}/ratings`);
            await addDoc(ratingsCollection, {
                rating: newRating,
                comment,
                timestamp: Date.now(),
            });
            setNewRating(0);
            setComment('');
            const updateSnapshot = await getDocs(ratingsCollection);
            const updateRatings = updateSnapshot.docs.map(doc => doc.data());
            setRatings(updateRatings);
            calculateAverageRating(updateRatings);
        } catch (error) {
            console.error('Erro ao adicionar avaliação: ', error);
        }
    };

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) {
            setAverageRating(0);
            return;
        }

        const totalRating = ratings.reduce((acc, rating) => {
            const validRating = typeof rating.rating === 'number' && !isNaN(rating.rating) ? rating.rating : 0;
            return acc + validRating;
        }, 0);

        const average = totalRating / ratings.length;
        setAverageRating(average);
    };

    return (
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 600, color: '#333' }}>
                Avaliações do Evento
            </Typography>
            <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2, boxShadow: 1, marginBottom: 3 }}>
                <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 600, color: '#333' }}>
                    Média: {averageRating.toFixed(1)} Estrelas
                </Typography>
            </Box>
            <Box sx={{ marginBottom: 3 }}>
                {ratings.map((rating, index) => (
                    <Card key={index} sx={{ marginBottom: 2, boxShadow: 2, borderRadius: 2 }}>
                        <CardContent>
                            <Typography sx={{ fontWeight: 600, color: '#ff9800' }}>{rating.rating} Estrelas</Typography>
                            <Typography sx={{ color: '#333', marginTop: 1 }}>{rating.comment}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <TextField
                type="number"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                inputProps={{ max: 5, min: 0 }}
                label="Avaliação"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{ marginBottom: 2 }}
            />
            <TextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deixe seu comentário."
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                sx={{ marginBottom: 2 }}
            />
            <Button
                onClick={handleRatingSubmit}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    padding: '12px 20px',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    borderRadius: 1, 
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },
                }}
            >
                ENVIAR
            </Button>
        </Container>
    );
};

export default EventRating;
