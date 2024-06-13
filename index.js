// Backend Node.js code using Express.js with ECMAScript modules

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/", (req, res) => {
    res.render("frontend");
});

// POST endpoint to handle latitude and longitude data
app.post('/api/uv-index', async (req, res) => {
  try {
    // Extract latitude and longitude from the request body
    const { latitude, longitude } = req.body;

    // Make a request to the UV index API with the latitude and longitude using Axios
    const uvIndexResponse = await axios.get('https://api.openuv.io/api/v1/uv', {
      params: {
        lat: latitude,
        lng: longitude,
        alt: 0, // Assuming altitude is not provided in the request
        dt: new Date().toISOString(), // Current date and time
      },
      headers: {
        'x-access-token': 'openuv-8q0fwjrlv5unjik-io', // Replace with your API key
      },
    });

    const uvIndexData = uvIndexResponse.data.result.uv;

    // Render the index.ejs file with the UV index data
    res.render('index', { uvIndex: uvIndexData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching UV index data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
