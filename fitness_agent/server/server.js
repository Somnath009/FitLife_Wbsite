require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let assistantId;

async function getOrCreateAssistant() {
    const existingAssistantId = "asst_99WeH5Jn4Z96dvYfFeNULL5Q";

    try {
        if (existingAssistantId) {
            const assistant = await openai.beta.assistants.retrieve(existingAssistantId);
            assistantId = assistant.id;
            console.log("Using existing assistant with ID:", assistantId);
            return;
        }

        const assistant = await openai.beta.assistants.create({
            name: "FitBot Coach",
            instructions: `You are 'FitBot', a friendly and encouraging AI fitness coach for the FitLife website. Your goal is to provide helpful and motivational fitness, nutrition, and wellness advice. 
            - Provide general health tips, workout suggestions, and nutritional guidance.
            - You MUST always include a disclaimer in your first message that you are an AI and users should consult a healthcare professional for personal medical advice.
            - Keep responses encouraging, positive, and easy to understand. Do not use overly complex jargon.
            - Do not provide personalized medical advice or diagnoses. If a user asks for medical advice, gently refuse and guide them to a healthcare professional.`,
            model: "gpt-4"
        });
        assistantId = assistant.id;
        console.log("Created a new assistant. ID:", assistantId);
        console.log("--> To re-use this assistant, copy its ID and paste it into the 'existingAssistantId' variable.");

    } catch (error) {
        console.error("Error getting or creating assistant:", error);
        throw error;
    }
}

app.post('/start', async (req, res) => {
    console.log("Received request to start a new session.");
    try {
        const thread = await openai.beta.threads.create();
        console.log("New thread created with ID:", thread.id);
        res.json({ threadId: thread.id });
    } catch (error) {
        console.error('Failed to start a new session:', error);
        res.status(500).json({ error: 'Failed to start a new session.' });
    }
});

app.post('/chat', async (req, res) => {
    const { threadId, message } = req.body;
    console.log(`Received message: "${message}" for thread: ${threadId}`);

    if (!threadId || !message) {
        return res.status(400).json({ error: 'threadId and message are required.' });
    }

    try {
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });
        console.log("Message added to thread. Running assistant...");

        const run = await openai.beta.threads.runs.createAndPoll(threadId, {
            assistant_id: assistantId,
        });

        console.log("Run completed with status:", run.status);

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(threadId);
            const response = messages.data[0].content[0].text.value;
            console.log("Assistant response:", response);
            res.json({ response });
        } else {
            console.error("Run failed with status:", run.status);
            res.status(500).json({ error: 'The assistant failed to process the message.' });
        }

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: 'An error occurred during the chat.' });
    }
});

getOrCreateAssistant().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(error => {
    console.error("Failed to initialize the assistant. Server not started.", error);
});
