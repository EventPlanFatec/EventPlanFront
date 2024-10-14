import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

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
        <Container>
            <Typography variant="h5">Nota: {averageRating.toFixed(1)}</Typography>
            {ratings.map((rating, index) => (
                <Box key={index} mb={2}>
                    <Typography>{rating.rating} Estrelas</Typography>
                    <Typography>{rating.comment}</Typography>
                </Box>
            ))}
            <TextField
                type="number"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                inputProps={{ max: 5, min: 0 }}
                label="Avaliação"
                variant="outlined"
                fullWidth
                margin="normal"
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
            />
            <Button onClick={handleRatingSubmit} variant="contained" color="primary">ENVIAR</Button>
        </Container>
    );
};

export default EventRating;
