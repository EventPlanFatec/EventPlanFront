import React, { useEffect, useState, useRef } from 'react';
import { ref, push, onValue, off, set } from 'firebase/database';
import { database } from '../../firebase/config';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const Chat = ({ eventId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesRef = useRef(null);

    useEffect(() => {
        if (eventId) {
            messagesRef.current = ref(database, `events/${eventId}/messages`);
            
            const fetchMessages = () => {
                onValue(messagesRef.current, (snapshot) => {
                    const data = snapshot.val();
                    const messagesList = data ? Object.values(data) : [];
                    const limitedMessages = messagesList.slice(-6);
                    setMessages(limitedMessages);
                });
            };
            
            fetchMessages();

            return () => {
                if (messagesRef.current) {
                    off(messagesRef.current, 'value');
                }
            };
        }
    }, [eventId]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (newMessage.trim() === '') return;

        const newMessageRef = push(messagesRef.current);

        set(newMessageRef, {
            text: newMessage,
            timestamp: Date.now(),
        }).then(() => {
            setNewMessage('');
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Chat em Tempo Real
                </Typography>
                <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 2 }}>
                    {messages.map((message, index) => (
                        <Box key={index} sx={{ padding: 1, borderBottom: '1px solid #ccc' }}>
                            {message.text}
                        </Box>
                    ))}
                </Box>
                <form onSubmit={handleSendMessage}>
                    <Box display="flex" alignItems="center">
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            sx={{ mr: 1 }}
                        />
                        <Button type="submit" variant="contained" color="primary" aria-label="Enviar">
                            ENVIAR
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Chat;
