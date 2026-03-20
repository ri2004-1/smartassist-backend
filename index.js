const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'SmartAssist backend is running!' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
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
```

**Now do this:**

**STEP 1** — Open `C:\Users\Reethu\smartassist-backend\index.js` in Notepad

**STEP 2** — Ctrl+A → Delete → paste code above → Ctrl+S

**STEP 3** — Command Prompt:
```
cd C:\Users\Reethu\smartassist-backend
git add .
git commit -m "fix cors"
git push
