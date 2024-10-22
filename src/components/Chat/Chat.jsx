import React, { useEffect, useState, useRef } from 'react';
import { ref, push, onValue, off, set } from 'firebase/database';
import { database } from '../../firebase/config';
import { Card, CardHeader, CardContent, TextField, Button, Box, Typography } from '@mui/material';

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
      console.error('Erro ao enviar a mensagem:', error);
    });
  };

  return (
    <Card sx={{ backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <CardHeader title={<Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 600, color: '#333' }}>Chat em Tempo Real</Typography>} />
      <CardContent>
        <Box sx={{ maxHeight: 300, overflowY: 'auto', marginBottom: 2 }}>
          {messages.map((message, index) => (
            <Box key={index} sx={{ padding: 1, backgroundColor: '#f0f0f0', marginBottom: 1, borderRadius: 1 }}>
              <Typography sx={{ color: '#333' }}>{message.text}</Typography>
            </Box>
          ))}
        </Box>
        <form onSubmit={handleSendMessage}>
          <Box display="flex" gap={1}>
            <TextField
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              sx={{ flexGrow: 1, borderRadius: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                padding: '12px',
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              ENVIAR
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default Chat;
