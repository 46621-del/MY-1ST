const KNOWLEDGE_BASE = [
  {
    id: "overview",
    title: "Project overview",
    keywords: ["overview", "project", "summary", "goal", "purpose"],
    response:
      "This chatbot is a single-page HTML, CSS, and JavaScript project. It keeps presentation, styles, and logic in separate files so you can understand and modify each layer quickly.",
  },
  {
    id: "features",
    title: "Key features",
    keywords: ["feature", "features", "function", "abilities", "what can"],
    response:
      "The bot shares tailored answers from a custom knowledge base, keeps a history of the conversation, and offers quick topic suggestions that refresh after every reply.",
  },
  {
    id: "data",
    title: "Custom data",
    keywords: ["data", "faq", "custom", "dataset", "information"],
    response:
      "All project facts live in data.js. Each entry includes an id, display title, keyword list, and the response shown to the user. Duplicate the object structure to add more answers.",
  },
  {
    id: "tech",
    title: "Technology stack",
    keywords: ["tech", "technology", "stack", "html", "css", "javascript"],
    response:
      "The chatbot runs entirely on the front end. Semantic HTML defines the layout, modern CSS handles the look and feel, and vanilla JavaScript manages the conversation flow.",
  },
  {
    id: "customize",
    title: "Customization",
    keywords: ["custom", "theme", "color", "style", "layout"],
    response:
      "Change colours, spacing, or typography by editing the CSS variables in styles.css. You can also adjust timing and scoring behaviour in script.js to fine-tune how the bot replies.",
  },
  {
    id: "usage",
    title: "How to use",
    keywords: ["how", "use", "start", "instructions", "guide"],
    response:
      "Open index.html in a browser, ask a question, and wait for the bot to respond. Select a quick topic to auto-fill a relevant message and see connected answers.",
  },
  {
    id: "roadmap",
    title: "Roadmap",
    keywords: ["roadmap", "next", "future", "plan", "milestone"],
    response:
      "Future enhancements could include fuzzy search, markdown support, and integration with a back-end service that stores real customer conversations.",
  },
  {
    id: "team",
    title: "Team",
    keywords: ["team", "members", "people", "contact", "who"],
    response:
      "Update this answer to describe the people behind your project. Mention who to contact for design, development, or project management questions.",
  },
  {
    id: "support",
    title: "Support",
    keywords: ["support", "help", "issue", "trouble", "bug"],
    response:
      "If the bot does not answer a question accurately, direct users to your documentation or an email contact. You can also link bug-reporting instructions here.",
  },
  {
    id: "github",
    title: "GitHub import",
    keywords: ["github", "repository", "remote", "push", "import"],
    response:
      "Create a new GitHub repository, then run `git remote add origin <repo-url>` followed by `git push -u origin main` (or the branch name you prefer). Enable GitHub Pages for static hosting if needed.",
  },
];

const DEFAULT_SUGGESTIONS = KNOWLEDGE_BASE.map(({ id, title }) => ({ id, title }));
