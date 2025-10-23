const BOT_NAME = "ChatGPT";
const USER_NAME = "You";
const API_URL = "https://api.openai.com/v1/chat/completions";
const TEMPERATURE = 0.7;

const conversation = document.getElementById("conversation");
const chatForm = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messageTemplate = document.getElementById("message-template");
const suggestionsList = document.getElementById("suggestions");
const statusLine = document.getElementById("status");
const apiKeyInput = document.getElementById("api-key");
const toggleKeyButton = document.getElementById("toggle-key-visibility");
const rememberKeyToggle = document.getElementById("remember-key");
const modelSelect = document.getElementById("model-select");
const modelDescription = document.getElementById("model-description");
const systemPromptInput = document.getElementById("system-prompt");
const resetChatButton = document.getElementById("reset-chat");

const storage = getStorage();
let conversationHistory = [];

function getStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    console.warn("Local storage is unavailable:", error);
    return null;
  }
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text = "") {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

function formatParagraph(section = "") {
  const trimmed = section.trim();
  if (!trimmed) {
    return "";
  }

  const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
  if (headingMatch) {
    const level = Math.min(headingMatch[1].length + 1, 6);
    return `<h${level}>${formatInline(headingMatch[2])}</h${level}>`;
  }

  const lines = trimmed.split(/\n/);
  const isBulletList = lines.every((line) => /^[-*]\s+/.test(line));
  const isOrderedList = lines.every((line) => /^\d+\.\s+/.test(line));

  if (isBulletList) {
    const items = lines
      .map((line) => `<li>${formatInline(line.replace(/^[-*]\s+/, ""))}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  if (isOrderedList) {
    const items = lines
      .map((line) => `<li>${formatInline(line.replace(/^\d+\.\s+/, ""))}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  }

  return `<p>${formatInline(trimmed)}</p>`;
}

function formatCodeBlock(segment = "") {
  let content = segment;
  let language = "";
  const newlineIndex = content.indexOf("\n");

  if (newlineIndex !== -1) {
    language = content.slice(0, newlineIndex).trim();
    content = content.slice(newlineIndex + 1);
  }

  if (!content.trim()) {
    content = language;
    language = "";
  }

  const code = escapeHtml(content.replace(/\s+$/, ""));
  const langLabel = language ? `<div class="code-block__lang">${escapeHtml(language)}</div>` : "";
  return `<pre class="code-block">${langLabel}<code>${code}</code></pre>`;
}

function formatMarkdown(markdown = "") {
  if (!markdown) {
    return "";
  }

  const segments = markdown.split(/```/);
  const html = segments
    .map((segment, index) => {
      if (index % 2 === 1) {
        return formatCodeBlock(segment);
      }

      return segment
        .split(/\n{2,}/)
        .map((block) => formatParagraph(block))
        .join("");
    })
    .join("")
    .trim();

  return html || `<p>${formatInline(markdown)}</p>`;
}

function updateTimestamp(node) {
  const now = new Date();
  const timestamp = node.querySelector(".timestamp");
  timestamp.dateTime = now.toISOString();
  timestamp.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setMessageContent(node, text, { markdown = false } = {}) {
  const textContainer = node.querySelector(".text");
  if (markdown) {
    textContainer.innerHTML = formatMarkdown(text);
  } else {
    textContainer.textContent = text;
  }
}

function createMessage({ sender, text = "", isUser = false, isPending = false, markdown = false, isError = false }) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.sender = sender;
  node.classList.toggle("message--user", Boolean(isUser));
  node.classList.toggle("message--pending", Boolean(isPending));
  node.classList.toggle("message--error", Boolean(isError));
  node.querySelector(".sender").textContent = sender;
  setMessageContent(node, text, { markdown: markdown && !isPending });
  updateTimestamp(node);
  conversation.appendChild(node);
  conversation.scrollTop = conversation.scrollHeight;
  return node;
}

function updateMessage(node, text, { markdown = false, isError = false } = {}) {
  node.classList.remove("message--pending");
  node.classList.toggle("message--error", Boolean(isError));
  setMessageContent(node, text, { markdown });
  updateTimestamp(node);
  conversation.scrollTop = conversation.scrollHeight;
}

function setStatus(message = "") {
  if (!message) {
    statusLine.hidden = true;
    statusLine.textContent = "";
    return;
  }

  statusLine.hidden = false;
  statusLine.textContent = message;
}

function renderModelOptions() {
  modelSelect.innerHTML = "";

  MODEL_OPTIONS.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    modelSelect.appendChild(option);
  });
}

function updateModelDescription() {
  const selected = MODEL_OPTIONS.find((option) => option.value === modelSelect.value);
  modelDescription.textContent = selected ? selected.description : "";
}

function renderSuggestions() {
  suggestionsList.innerHTML = "";

  SUGGESTED_PROMPTS.forEach(({ title, prompt }) => {
    const item = document.createElement("li");
    item.className = "suggestion";
    item.tabIndex = 0;
    item.dataset.prompt = prompt;
    item.textContent = title;

    const sendPrompt = () => handleSuggestion(prompt);
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

function safeSetItem(key, value) {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch (error) {
    console.warn("Unable to persist setting:", error);
  }
}

function safeRemoveItem(key) {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn("Unable to remove setting:", error);
  }
}

function hydrateSettings() {
  renderModelOptions();

  const storedModel = storage?.getItem(STORAGE_KEYS.model);
  modelSelect.value = MODEL_OPTIONS.some((option) => option.value === storedModel)
    ? storedModel
    : MODEL_OPTIONS[0].value;
  updateModelDescription();

  const storedPrompt = storage?.getItem(STORAGE_KEYS.systemPrompt);
  systemPromptInput.value = storedPrompt || DEFAULT_SYSTEM_PROMPT;

  const rememberKey = storage?.getItem(STORAGE_KEYS.rememberKey) === "true";
  rememberKeyToggle.checked = rememberKey;
  if (rememberKey) {
    const storedKey = storage?.getItem(STORAGE_KEYS.apiKey);
    if (storedKey) {
      apiKeyInput.value = storedKey;
    }
  }
}

function syncStoredApiKey() {
  safeSetItem(STORAGE_KEYS.rememberKey, rememberKeyToggle.checked ? "true" : "false");
  if (rememberKeyToggle.checked) {
    safeSetItem(STORAGE_KEYS.apiKey, apiKeyInput.value.trim());
  } else {
    safeRemoveItem(STORAGE_KEYS.apiKey);
  }
}

function handleSuggestion(prompt) {
  input.value = prompt;
  input.focus();
  chatForm.requestSubmit();
}

async function requestChatCompletion({ apiKey, model, systemPrompt, messages }) {
  const payload = {
    model,
    messages: [
      { role: "system", content: systemPrompt || DEFAULT_SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: TEMPERATURE,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errorPayload = await response.json();
      detail = errorPayload?.error?.message || detail;
    } catch (error) {
      // ignore JSON parsing issue
    }
    throw new Error(detail);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("ChatGPT returned an empty response. Try asking again.");
  }

  return reply;
}

async function handleSubmit(event) {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    setStatus("Add your OpenAI API key in the sidebar to connect.");
    createMessage({
      sender: BOT_NAME,
      text: "I need your OpenAI API key before I can reply. Paste it in the sidebar and press Send again.",
      isError: true,
    });
    return;
  }

  input.value = "";
  createMessage({ sender: USER_NAME, text: message, isUser: true });
  conversationHistory.push({ role: "user", content: message });
  syncStoredApiKey();

  const thinkingMessage = createMessage({ sender: BOT_NAME, text: "Thinking…", isPending: true });
  setStatus("ChatGPT is thinking…");

  try {
    const reply = await requestChatCompletion({
      apiKey,
      model: modelSelect.value,
      systemPrompt: systemPromptInput.value.trim(),
      messages: conversationHistory,
    });

    conversationHistory.push({ role: "assistant", content: reply });
    updateMessage(thinkingMessage, reply, { markdown: true });
    setStatus(`Response received at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
  } catch (error) {
    const last = conversationHistory[conversationHistory.length - 1];
    if (last?.role === "user" && last.content === message) {
      conversationHistory.pop();
    }

    updateMessage(thinkingMessage, `Error: ${error.message}`, { isError: true });
    setStatus(`Error: ${error.message}`);
  }
}

function resetConversation(announce = true) {
  conversationHistory = [];
  conversation.innerHTML = "";
  if (announce) {
    createMessage({
      sender: BOT_NAME,
      text: "Welcome! Add your OpenAI API key on the right, then ask me anything about your project.",
    });
  }
  setStatus("Conversation reset. Ready when you are.");
}

chatForm.addEventListener("submit", handleSubmit);
resetChatButton.addEventListener("click", () => resetConversation(true));

toggleKeyButton.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  toggleKeyButton.textContent = isPassword ? "Hide" : "Show";
  toggleKeyButton.setAttribute("aria-pressed", String(isPassword));
  toggleKeyButton.setAttribute("aria-label", isPassword ? "Hide API key" : "Show API key");
});

rememberKeyToggle.addEventListener("change", () => {
  syncStoredApiKey();
  setStatus(
    rememberKeyToggle.checked
      ? "Your API key will be stored on this device."
      : "Stored API key cleared. It will not be saved locally.",
  );
});

apiKeyInput.addEventListener("input", () => {
  if (rememberKeyToggle.checked) {
    syncStoredApiKey();
  }
});

modelSelect.addEventListener("change", () => {
  safeSetItem(STORAGE_KEYS.model, modelSelect.value);
  updateModelDescription();
  const selectedOption = modelSelect.options[modelSelect.selectedIndex];
  const label = selectedOption ? selectedOption.textContent : modelSelect.value;
  setStatus(`Model switched to ${label}.`);
});

systemPromptInput.addEventListener("input", () => {
  safeSetItem(STORAGE_KEYS.systemPrompt, systemPromptInput.value);
});

renderSuggestions();
hydrateSettings();
resetConversation(true);
setStatus("Enter a prompt to begin chatting.");
