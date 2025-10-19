# Project Data Chatbot

A polished HTML, CSS, and JavaScript chatbot that now talks directly to the OpenAI Chat Completions API. The front end keeps the
interface responsive and accessible, while a lightweight Express proxy securely forwards requests to OpenAI so your API key stays
on the server.

## Project structure

```
├── index.html       # Semantic layout, conversation area, and info panel
├── styles.css       # Visual theme, layout rules, and animations
├── script.js        # Chat UI behaviour and calls to the proxy API
├── server.js        # Express proxy that relays chat requests to OpenAI
├── package.json     # Node dependencies and npm scripts
├── .env.example     # Template for environment variables required by the proxy
├── config.sample.js # Optional front-end configuration template
└── .gitignore       # Ignores environment files and local dependencies
```

## Requirements

- Node.js 18 or later (for native `fetch` support used by the Express proxy)
- An OpenAI API key with access to the Chat Completions endpoint

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root. A starter template is provided in `.env.example`:
   ```bash
   OPENAI_API_KEY=sk-your-api-key
   ```
   Optional variables:
   - `PORT`: Port for the Express proxy (defaults to `3000`).
   - `OPENAI_MODEL`: Override the default `gpt-4o-mini` model.
   - `OPENAI_BASE_URL`: Target a compatible OpenAI-compatible endpoint (e.g., Azure OpenAI).
   - `CORS_ORIGIN`: Comma-separated list of allowed origins for browsers other than `http://localhost`.

3. **Run the proxy server**
   ```bash
   npm start
   ```
   The server exposes `POST /api/chat` and a diagnostic `GET /health` endpoint. Check the console to confirm it is listening.

4. **Configure (optional) front-end overrides**
   - Copy `config.sample.js` to `config.js` if you need to point the browser to a remote proxy or tweak the default model/temperature.
   - Ensure the file is loaded before `script.js` in `index.html` when deploying (e.g., `<script src="config.js"></script>`).

5. **Open the front end**
   - Use the Live Server extension, `python -m http.server`, or any static host to serve the project directory.
   - Visit the site (e.g., `http://127.0.0.1:5500/index.html`) and start chatting. The browser sends messages to the proxy, which
     forwards them to OpenAI and returns the response.

## Front-end behaviour

- The conversation history is summarised into a rolling window so follow-up questions remain in context without exceeding token
  limits.
- Quick topic shortcuts in the sidebar populate helpful prompts that highlight the project goals, technology stack, deployment
  advice, and troubleshooting steps.
- A typing indicator appears while the proxy is working so users know a response is on the way.
- The input form and quick-topic suggestions temporarily disable while waiting for the API, preventing duplicate submissions and improving accessibility.
- Error messages from the proxy are surfaced in the chat window with next steps for debugging.

## Customising the chatbot

- **Update the system prompt** inside `script.js` to change the assistant's personality or scope.
- **Adjust quick topics** by editing the `quickTopics` array. You can tailor the copy or add more prompts.
- **Change styling** by tuning the CSS variables at the top of `styles.css` for colours, fonts, and shadows.
- **Point to another backend** by creating a `config.js` file that sets `window.CHATBOT_CONFIG.apiBaseUrl` to a different URL and
  including it before `script.js` in `index.html`.

## Troubleshooting

- **401 or 403 errors:** Confirm the API key in `.env` is correct and has permissions for the chosen model.
- **CORS blocks:** Set `CORS_ORIGIN` to the scheme + host (and port) of the site serving `index.html`.
- **Network errors:** Ensure both the static site and the proxy server are running, and check the browser console for the failed
  request details.
- **Long responses or truncation:** Adjust the `MAX_HISTORY` or `temperature` constants in `script.js`, or choose a model with a
  larger context window.

## Deploying

- Deploy `index.html`, `styles.css`, and `script.js` to any static host (GitHub Pages, Netlify, Vercel static, etc.).
- Deploy `server.js` to a Node-compatible environment (Render, Railway, Fly.io, Azure App Service, etc.) with the same `.env`
  values. Make sure the static front end points to the hosted proxy URL via `config.js` or environment-specific configuration.
- Rotate your OpenAI API key regularly and store it securely using the hosting provider's secrets manager.

## Next steps

- Add streaming responses to show answers as they are generated.
- Persist conversation history to a database for analytics or to resume chats.
- Integrate authentication so only authorised users can access the proxy endpoint.
