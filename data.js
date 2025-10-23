const MODEL_OPTIONS = [
  {
    value: "gpt-4o-mini",
    label: "GPT-4o mini (fast, cost-efficient)",
    description: "Great default choice for most conversations.",
  },
  {
    value: "gpt-4o",
    label: "GPT-4o (higher-quality responses)",
    description: "Use when you need the most accurate answers.",
  },
  {
    value: "gpt-4o-mini-translate",
    label: "GPT-4o mini Translate (multilingual)",
    description: "Designed for translating or multilingual chats.",
  },
];

const SUGGESTED_PROMPTS = [
  {
    title: "Explain my project idea",
    prompt: "Help me describe the main goal of my project in a single paragraph.",
  },
  {
    title: "Draft user stories",
    prompt: "Create three concise user stories for this project with acceptance criteria.",
  },
  {
    title: "Outline a roadmap",
    prompt: "Propose a four-phase roadmap that covers discovery, design, development, and launch.",
  },
  {
    title: "Brainstorm features",
    prompt: "List five standout features that would make this project delightful to users.",
  },
  {
    title: "Write release notes",
    prompt: "Write friendly release notes for the latest update of this project.",
  },
  {
    title: "Suggest improvements",
    prompt: "Review my project concept and suggest improvements or risks to watch out for.",
  },
];

const DEFAULT_SYSTEM_PROMPT = `You are a supportive project assistant embedded in a web demo. 
- Keep answers concise, structured, and actionable.
- When asked for plans or lists, format them with short headings or bullet points.
- If the user asks for code, provide syntax-highlighted Markdown snippets when possible.
- Always be friendly and professional.`;

const STORAGE_KEYS = {
  apiKey: "chatgpt-demo-api-key",
  rememberKey: "chatgpt-demo-remember-key",
  model: "chatgpt-demo-model",
  systemPrompt: "chatgpt-demo-system-prompt",
};
