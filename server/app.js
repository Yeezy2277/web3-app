const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;
  console.log(event)
  events.push(event);
  res.status(200).send('Event saved');
});

app.get('/events', (req, res) => {
  res.status(200).json(events);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
