const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), 'joke.json');

  if (req.method === 'GET') {
    const jokes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.status(200).json(jokes);
  } else if (req.method === 'POST') {
    const { id, joke } = req.body;

    if (!joke) {
      return res.status(400).json({ message: 'Invalid joke!' });
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const jokes = JSON.parse(data);
      jokes.push({ id, joke });

      fs.writeFileSync(filePath, JSON.stringify(jokes, null, 2), 'utf-8');
      res.status(201).json({ message: 'Joke added successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add joke.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
