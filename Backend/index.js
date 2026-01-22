const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ message: 'Backend is running on GKE ' });
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
