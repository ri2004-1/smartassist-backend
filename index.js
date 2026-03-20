const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 10mb for image uploads

// Health check — Render needs this to confirm app is running
app.get('/', (req, res) => {
  res.json({ status: 'SmartAssist backend is running!' });
});

// Main route — all 4 features use this same endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SmartAssist backend running on port ${PORT}`);
});
