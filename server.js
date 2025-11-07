const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// In-memory storage for pins (can be upgraded to a database later)
let pins = [];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/pins', (req, res) => {
  res.json(pins);
});

app.post('/api/pins', (req, res) => {
  const { latitude, longitude, accuracy, timestamp, userAgent } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  const pin = {
    id: Date.now().toString(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    accuracy: accuracy || null,
    timestamp: timestamp || new Date().toISOString(),
    userAgent: userAgent || 'Unknown',
    createdAt: new Date().toISOString()
  };
  
  pins.push(pin);
  
  // Broadcast the new pin to all connected clients
  io.emit('newPin', pin);
  
  res.status(201).json(pin);
});

app.delete('/api/pins/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = pins.length;
  pins = pins.filter(pin => pin.id !== id);
  
  if (pins.length < initialLength) {
    io.emit('pinDeleted', { id });
    res.json({ message: 'Pin deleted successfully' });
  } else {
    res.status(404).json({ error: 'Pin not found' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send existing pins to newly connected client
  socket.emit('existingPins', pins);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});