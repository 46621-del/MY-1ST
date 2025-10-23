# ChatGPT Project Assistant

A polished HTML, CSS, and JavaScript chatbot that connects directly to the ChatGPT API. The layout, styling, and behaviour live in separate files so you can study or customise each layer independently. Users provide their own OpenAI API key (kept in the browser if requested) and receive real ChatGPT responses with helpful formatting for lists, headings, and code blocks.

## Project structure

```
├── index.html   # Semantic markup for the layout, sidebar controls, and message template
├── styles.css   # Modern interface styling, typography, and responsive rules
├── data.js      # Model list, quick-prompt suggestions, and local-storage key names
└── script.js    # ChatGPT API integration, conversation flow, formatting, and UI logic
```

## Prerequisites

1. Create an OpenAI account and generate an API key from the [OpenAI dashboard](https://platform.openai.com/). The demo targets the
   cost-efficient `gpt-4o-mini` model by default, but you can select any option listed in the sidebar.
2. Keep your key private. The optional “Remember this key” toggle stores it only in `localStorage` on the current device.

## Getting started

1. Open `index.html` in your browser. No build steps or servers are required.
2. Paste your OpenAI API key into the **Connect to ChatGPT** panel.
3. Pick a model, adjust the system instructions if needed, and press **Send** to chat in real time.
4. Use the quick prompts to auto-fill the input with project-friendly starter questions.

## Key features

- **Live ChatGPT answers:** Messages are sent to the official Chat Completions API and streamed back into the interface once the
  response arrives.
- **Conversation management:** Reset the thread at any time, tweak the model or system prompt, and watch the assistant adapt to your
  new instructions.
- **Formatted responses:** Lightweight Markdown handling highlights headings, bullet lists, and fenced code blocks for readable
  answers.
- **Local persistence:** The selected model, system prompt, and optional API key are saved to `localStorage` so they survive page
  reloads when desired.

## Customisation tips

- Update the quick prompts inside `data.js` to match your project or audience.
- Tailor the default system instructions in the same file for tone, structure, or formatting guidance.
- Adjust colours, spacing, and shadows by editing the CSS variables at the top of `styles.css`.
- Extend the Markdown formatter in `script.js` if you want richer rendering (tables, block quotes, etc.).

## Deployment

1. Create a new GitHub repository and push the files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
2. Enable **GitHub Pages** (or any static hosting provider) to share the chatbot as a live demo.

> ⚠️ **Security reminder:** Never publish your personal API key in a public repository. Ask end users to supply their own key before
> chatting.
