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
    const endpoint = `https://api.groq.com/openai/v1/chat/completions`;
    
    const prompt = `Analyze this email for phishing. Return a JSON object with exactly two keys: "riskLevel" (must be exactly "Low", "Medium", "High", or "Critical") and "findings" (an array of strings explaining the red flags). Email: "${text}"`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error("API request to Groq failed.");
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    res.json(result); // Send the parsed result back to tools.html
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze email." });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Secure backend running on http://localhost:${PORT}`));