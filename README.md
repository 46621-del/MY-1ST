# ChatGPT Data Chatbot

A polished single-page chatbot interface that speaks directly to the official OpenAI APIs (Chat Completions and the newer Responses endpoint).
This project is built with semantic HTML, modular CSS, and vanilla JavaScript for easy customization and classroom presentations.

## Features

- 🔐 Client-side settings panel to paste your own OpenAI API key
- 🤖 Support for modern ChatGPT models (gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo)
- 🧠 Optional system prompt to steer the assistant for custom coursework scenarios
- 💬 Clean conversation timeline with timestamps, delivery status, and helpful info messages
- 💾 Optional local storage so you can remember your settings on the same device

## Getting started

1. Clone or download this repository.
2. For the smoothest experience, serve the folder with a lightweight web server (for example, `python -m http.server 5500`) and visit `http://127.0.0.1:5500/index.html`.
3. Click **Settings**, paste your OpenAI API key, choose a model, and save.
4. Start chatting &mdash; the bot will answer with live responses from ChatGPT.

> ⚠️ **Security tip:** This demo calls OpenAI directly from the browser. For production use, route requests through your own backend so you can hide the API key and manage quotas safely.

## Project structure

```
index.html   # App layout and semantics
styles.css   # Responsive neon-inspired styling
script.js    # Chat flow, API calls, and settings management
```

Feel free to expand the UI, add streaming responses, or plug the logic into your own data projects.

## Troubleshooting

- **“Not delivered” badge after sending a message**: The request to OpenAI did not reach the API successfully. Check the detailed system message that appears below the chat, confirm your internet connection, and make sure your API key is valid and has access to the selected model.
- **401 / 429 errors**: OpenAI returns these when the key is invalid or you have reached a usage limit. Switching to a different model (for example `gpt-4o-mini`) can help if your account does not include higher-tier models.
- **Nothing happens when pressing send**: The app prevents multiple requests at the same time. Wait until the send button changes back from “Sending…” to “Send” before trying again.
