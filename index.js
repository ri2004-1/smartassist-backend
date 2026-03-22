const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'SmartAssist backend is running!' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: req.body.messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));

    const text = data.choices?.[0]?.message?.content ||
                 data.error?.message ||
                 'No response';

    res.json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
setInterval(async () => {
  try {
    await fetch('https://smartassist-backend.onrender.com');
    console.log('Keeping backend awake...');
  } catch (err) {
    console.log('Ping failed:', err.message);
  }
}, 14 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SmartAssist backend running on port ${PORT}`);
});
