const BOT_NAME = "Project Bot";
const USER_NAME = "You";
const TYPING_DELAY = 400;
const MIN_CONFIDENCE = 3;

const conversation = document.getElementById("conversation");
const chatForm = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messageTemplate = document.getElementById("message-template");
const suggestionsList = document.getElementById("suggestions");

function createMessageElement({ sender, text, isUser }) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.sender = sender;
  node.classList.toggle("message--user", Boolean(isUser));
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

function normalise(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreEntry(entry, question) {
  return entry.keywords.reduce((total, keyword) => {
    return question.includes(keyword) ? total + keyword.length : total;
  }, 0);
}

function findAnswer(question) {
  const prepared = normalise(question);

  return KNOWLEDGE_BASE.reduce(
    (best, entry) => {
      const score = scoreEntry(entry, prepared);
      if (score > best.confidence) {
        return { confidence: score, entry };
      }
      return best;
    },
    { confidence: 0, entry: null }
  );
}

function renderSuggestions(entries) {
  suggestionsList.innerHTML = "";

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "suggestion";
    item.textContent = entry.title;
    item.tabIndex = 0;
    item.dataset.topic = entry.id;
    item.addEventListener("click", () => handleSuggestion(entry.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSuggestion(entry.id);
      }
    });
    suggestionsList.appendChild(item);
  });
}

function filterSuggestions(activeId) {
  return DEFAULT_SUGGESTIONS.filter((entry) => entry.id !== activeId).slice(0, 6);
}

async function replyToUser(message) {
  addMessage({ sender: USER_NAME, text: message, isUser: true });

  await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY));

  const { entry, confidence } = findAnswer(message);

  if (entry && confidence >= MIN_CONFIDENCE) {
    addMessage({ sender: BOT_NAME, text: entry.response });
    renderSuggestions(filterSuggestions(entry.id));
  } else {
    addMessage({
      sender: BOT_NAME,
      text:
        "I did not find an exact answer in the knowledge base. Try a different phrasing or explore one of the quick topics.",
    });
    renderSuggestions(DEFAULT_SUGGESTIONS.slice(0, 6));
  }
}

function handleSuggestion(id) {
  const entry = KNOWLEDGE_BASE.find((item) => item.id === id);
  if (!entry) return;

  input.value = "";
  replyToUser(entry.title);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  replyToUser(message);
});

renderSuggestions(DEFAULT_SUGGESTIONS.slice(0, 6));
addMessage({
  sender: BOT_NAME,
  text: "Welcome! Ask me anything about this project, or choose a quick topic to learn more.",
});
