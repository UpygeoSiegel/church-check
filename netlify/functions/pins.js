const fs = require('fs');
const path = require('path');

// Simple file-based storage for demo (use a database for production)
const PINS_FILE = '/tmp/pins.json';

// Helper functions
function readPins() {
  try {
    if (fs.existsSync(PINS_FILE)) {
      const data = fs.readFileSync(PINS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading pins:', error);
  }
  return [];
}

function writePins(pins) {
  try {
    fs.writeFileSync(PINS_FILE, JSON.stringify(pins, null, 2));
  } catch (error) {
    console.error('Error writing pins:', error);
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const pins = readPins();

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Get all pins
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(pins)
        };

      case 'POST':
        // Create a new pin
        const { latitude, longitude, accuracy, timestamp, userAgent } = JSON.parse(event.body);
        
        if (!latitude || !longitude) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Latitude and longitude are required' })
          };
        }
        
        const newPin = {
          id: Date.now().toString(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          accuracy: accuracy || null,
          timestamp: timestamp || new Date().toISOString(),
          userAgent: userAgent || 'Unknown',
          createdAt: new Date().toISOString()
        };
        
        pins.push(newPin);
        writePins(pins);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newPin)
        };

      case 'DELETE':
        // Delete a pin
        const pathParts = event.path.split('/');
        const pinId = pathParts[pathParts.length - 1];
        
        const initialLength = pins.length;
        const filteredPins = pins.filter(pin => pin.id !== pinId);
        
        if (filteredPins.length < initialLength) {
          writePins(filteredPins);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Pin deleted successfully' })
          };
        } else {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Pin not found' })
          };
        }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};