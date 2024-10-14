import React, { useEffect, useState, useRef } from 'react';
import { ref, push, onValue, off, set } from 'firebase/database';
import { database } from '../../firebase/config';
import { Container, Card, CardHeader, CardContent, TextField, Button, Box, Typography } from '@mui/material';

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
    <Container>
      <Card>
        <CardHeader title={<Typography variant="h6">Chat em Tempo Real</Typography>} />
        <CardContent>
          <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
            {messages.map((message, index) => (
              <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                {message.text}
              </Typography>
            ))}
          </Box>
          <form onSubmit={handleSendMessage}>
            <Box display="flex" gap={1}>
              <TextField
                variant="outlined"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <Button type="submit" variant="contained" color="primary">ENVIAR</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Chat;
