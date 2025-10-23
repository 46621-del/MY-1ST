# Project Data Chatbot

A clean HTML, CSS, and JavaScript chatbot that answers questions using a custom data set. Each layer of the project lives in its
own file so you can quickly understand and adapt the structure, styling, or behaviour.

## Project structure

```
├── index.html   # Semantic markup and layout containers
├── styles.css   # Modern yet minimal visual theme
├── data.js      # Knowledge base entries and quick-topic metadata
└── script.js    # Conversation flow, scoring, and UI updates
```

## Getting started

1. **Open `index.html` in a browser.** No build tools or servers are required.
2. **Ask a question in the input field.** The chatbot looks for the closest match in `data.js` and displays the related answer.
3. **Use the quick topics.** Selecting a suggestion sends the mapped question automatically and reveals follow-up ideas.

## Customising the knowledge base

- Duplicate an existing entry inside `KNOWLEDGE_BASE` and adjust the `id`, `title`, `keywords`, and `response` fields.
- Keep keywords short and descriptive. The scoring function awards more points to longer matches, so include important phrases.
- Update `DEFAULT_SUGGESTIONS` if you want to highlight a smaller set of topics on load.

## Styling tips

- Global colours, spacing, and shadows are defined at the top of `styles.css`. Tweak the CSS variables to align with your
  branding.
- The layout adapts between desktop and mobile breakpoints. Modify the `@media` rules if you want a different layout on smaller
  screens.

## Publishing the project to GitHub

1. Create a new repository on GitHub (public or private).
2. Inside this project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
3. To share the chatbot as a live demo, enable **GitHub Pages** for the repository and choose the `main` branch as the source.

## Next steps

- Enhance the keyword matching with fuzzy search for friendlier responses.
- Store conversation history or analytics in localStorage or a database service.
- Replace the static knowledge base with an API request if you need real-time data.
