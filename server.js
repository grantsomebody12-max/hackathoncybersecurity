require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your HTML file to communicate with this server
app.use(express.json()); // Allows the server to read JSON data

app.post('/analyze', async (req, res) => {
  try {
    const text = req.body.text;
    const apiKey = process.env.API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `Analyze this email for phishing. Return a JSON object with exactly two keys: "riskLevel" (must be exactly "Low", "Medium", "High", or "Critical") and "findings" (an array of strings explaining the red flags). Email: "${text}"`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!response.ok) throw new Error("API request to Google failed.");
    
    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    res.json(result); // Send the parsed result back to tools.html
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze email." });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Secure backend running on http://localhost:${PORT}`));