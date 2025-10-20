# ChatGPT Data Chatbot

A polished single-page chatbot interface that uses the official OpenAI Chat Completions API. This project is built with semantic HTML, modular CSS, and vanilla JavaScript for easy customization and classroom presentations.

## Features

- 🔐 Client-side settings panel to paste your own OpenAI API key
- 🤖 Support for modern ChatGPT models (gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo)
- 🧠 Optional system prompt to steer the assistant for custom coursework scenarios
- 💬 Clean conversation timeline with timestamps and helpful info messages
- 💾 Optional local storage so you can remember your settings on the same device

## Getting started

1. Clone or download this repository.
2. Open `index.html` in your browser (no build tools required).
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
