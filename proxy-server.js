const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Proxy endpoint for Involve Asia API
app.post('/api/*', async (req, res) => {
  try {
    const apiPath = req.path.replace('/api', '');
    const targetUrl = `https://api.involve.asia${apiPath}`;
    
    console.log('Proxying request to:', targetUrl);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    // Convert JSON to form data for Involve Asia API
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        formData.append(key, req.body[key]);
      }
    });

    console.log('Form data:', formData.toString());

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; InvolveAsia-Proxy/1.0)',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      },
      body: formData.toString(),
      timeout: 30000 // 30 second timeout
    });

    console.log('Response status:', response.status);
    
    const data = await response.text();
    console.log('Response data:', data);

    // Set response headers
    res.status(response.status);
    res.set('Content-Type', 'application/json');
    
    // Try to parse as JSON, fallback to text
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (e) {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Proxy server error: ' + error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Proxy server running on http://127.0.0.1:${PORT}`);
  console.log(`Health check available at http://127.0.0.1:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});