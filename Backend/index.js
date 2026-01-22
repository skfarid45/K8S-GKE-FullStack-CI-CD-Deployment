const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running on GKE 🚀' });
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
