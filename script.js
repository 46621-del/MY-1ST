const BOT_NAME = "Project Bot";
const USER_NAME = "You";
const API_ENDPOINT = window.CHATBOT_CONFIG?.apiBaseUrl || "http://localhost:3000/api/chat";
const MODEL = window.CHATBOT_CONFIG?.model || "gpt-4o-mini";
const TEMPERATURE = window.CHATBOT_CONFIG?.temperature ?? 0.6;
const MAX_HISTORY = 12;
const TYPING_DELAY = 350;

const conversation = document.getElementById("conversation");
const chatForm = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messageTemplate = document.getElementById("message-template");
const suggestionsList = document.getElementById("suggestions");

const quickTopics = [
  {
    id: "scope",
    title: "What is the main goal of this project?",
    prompt: "Give me a concise overview of the project goals for this HTML, CSS, and JavaScript chatbot demo.",
  },
  {
    id: "tech",
    title: "Which technologies does it use?",
    prompt:
      "List the core technologies and any supporting tools used in this chatbot project using bullet points.",
  },
  {
    id: "improvements",
    title: "How can I extend the chatbot?",
    prompt: "Suggest three meaningful improvements I could make to this chatbot project in the future.",
  },
  {
    id: "deployment",
    title: "How do I deploy it?",
    prompt:
      "Explain how to deploy this chatbot with a small Express proxy to a static hosting platform and keep the API key secure.",
  },
  {
    id: "api",
    title: "How does the ChatGPT API call work?",
    prompt:
      "Describe how the frontend communicates with the Express proxy and how the proxy relays the request to the OpenAI Chat Completions API.",
  },
  {
    id: "troubleshooting",
    title: "What if something goes wrong?",
    prompt:
      "Provide troubleshooting steps for common setup problems like missing API keys, network errors, or CORS blocks.",
  },
];

const conversationHistory = [
  {
    role: "system",
    content:
      "You are a friendly assistant helping people understand and customise a front-end chatbot project that uses the OpenAI Chat Completions API through an Express proxy server. Provide structured, practical answers.",
  },
];

function createMessageElement({ sender, text, isUser, isTyping }) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.sender = sender;
  node.classList.toggle("message--user", Boolean(isUser));
  node.classList.toggle("message--typing", Boolean(isTyping));
  node.querySelector(".sender").textContent = sender;
  node.querySelector(".text").textContent = text;

  const now = new Date();
  const timestamp = node.querySelector(".timestamp");
  timestamp.dateTime = now.toISOString();
  timestamp.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return node;
}

function addMessage(payload) {
  conversation.appendChild(createMessageElement(payload));
  conversation.scrollTop = conversation.scrollHeight;
}

function showTypingIndicator() {
  const typingNode = createMessageElement({ sender: BOT_NAME, text: "Typing…", isTyping: true });
  conversation.appendChild(typingNode);
  conversation.scrollTop = conversation.scrollHeight;
  return typingNode;
}

function updateTypingIndicator(node, text) {
  if (!node) return;
  node.querySelector(".text").textContent = text;
}

function removeTypingIndicator(node) {
  if (!node || !node.parentElement) return;
  node.parentElement.removeChild(node);
}

function renderSuggestions(entries) {
  suggestionsList.innerHTML = "";
  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "suggestion";
    item.textContent = entry.title;
    item.tabIndex = 0;
    item.dataset.topic = entry.id;
    const sendPrompt = () => {
      input.value = "";
      handleUserMessage(entry.prompt);
    };
    item.addEventListener("click", sendPrompt);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sendPrompt();
      }
    });
    suggestionsList.appendChild(item);
  });
}

function trimHistory() {
  const interactiveMessages = conversationHistory.filter((message) => message.role !== "system");
  if (interactiveMessages.length <= MAX_HISTORY) return;

  const systemPrompt = conversationHistory.find((message) => message.role === "system");
  const trimmed = interactiveMessages.slice(-MAX_HISTORY);
  conversationHistory.length = 0;
  if (systemPrompt) conversationHistory.push(systemPrompt);
  conversationHistory.push(...trimmed);
}

async function requestAssistant(messages) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, model: MODEL, temperature: TEMPERATURE }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const errorMessage = errorPayload.error || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return response.json();
}

async function handleUserMessage(message) {
  const text = message.trim();
  if (!text) return;

  addMessage({ sender: USER_NAME, text, isUser: true });
  conversationHistory.push({ role: "user", content: text });
  trimHistory();

  const typingNode = showTypingIndicator();
  await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY));

  try {
    const payload = await requestAssistant(conversationHistory);
    const reply = payload.reply || payload.choices?.[0]?.message?.content || "I could not find a response.";
    conversationHistory.push({ role: "assistant", content: reply });
    trimHistory();

    removeTypingIndicator(typingNode);
    addMessage({ sender: BOT_NAME, text: reply });
  } catch (error) {
    updateTypingIndicator(typingNode, "Something went wrong while contacting the assistant.");
    setTimeout(() => {
      removeTypingIndicator(typingNode);
      addMessage({
        sender: BOT_NAME,
        text: `I hit an error talking to the API: ${error.message}. Check your server logs and try again.`,
      });
    }, 600);
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value;
  input.value = "";
  handleUserMessage(message);
});

renderSuggestions(quickTopics);

const welcomeText =
  "Welcome! Ask anything about this project or choose a quick topic to learn how the ChatGPT integration works.";
addMessage({
  sender: BOT_NAME,
  text: welcomeText,
});
conversationHistory.push({ role: "assistant", content: welcomeText });
