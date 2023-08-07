const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

app.post('/get-response', async (req, res) => {
    const userInput = req.body.message;

    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: userInput,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': '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',
                'Content-Type': 'application/json'
            }
        });

        const botReply = openaiResponse.data.choices[0].text.trim();
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error querying OpenAI:", error);
        res.status(500).json({ error: "Failed to get a response from the bot" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
