const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

// Middleware to parse JSON body
app.use(express.json());

// GET /numbers endpoint
app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No URLs provided in the query parameters' });
  }

  if (!Array.isArray(url)) {
    // Convert single URL to an array to handle both single and multiple URL cases
    url = [url];
  }

  const results = {};

  try {
    // Send concurrent requests using axios.all
    await axios.all(url.map(fetchData))
      .then(axios.spread((...responses) => {
        responses.forEach((response, index) => {
          results[url[index]] = response.data;
        });
      }));
      
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching data from the server' });
  }
});

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return null;
  }
}

app.listen(port, () => {
  console.log(`Number management service is running on http://localhost:${port}`);
});
