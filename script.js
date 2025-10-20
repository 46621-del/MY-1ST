const conversationEl = document.getElementById("conversation");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const settingsPanel = document.getElementById("settingsPanel");
const settingsForm = document.getElementById("settingsForm");
const apiKeyInput = document.getElementById("apiKeyInput");
const modelSelect = document.getElementById("modelSelect");
const systemPromptInput = document.getElementById("systemPromptInput");
const rememberSettings = document.getElementById("rememberSettings");
const resetSettings = document.getElementById("resetSettings");
const toggleSettings = document.getElementById("toggleSettings");
const messageTemplate = document.getElementById("messageTemplate");

const STORAGE_KEY = "chatgpt-data-chatbot-settings";

let conversationHistory = [];
let settings = {
  apiKey: "",
  model: "gpt-4o",
  systemPrompt: "You are a helpful and knowledgeable assistant.",
  remember: false,
};

initialize();

function initialize() {
  const saved = loadSettings();
  if (saved) {
    settings = { ...settings, ...saved };
    apiKeyInput.value = settings.apiKey;
    modelSelect.value = settings.model;
    systemPromptInput.value = settings.systemPrompt;
    rememberSettings.checked = settings.remember;
  }

  renderInfoMessage(
    "assistant",
    "👋 Hi! I'm your ChatGPT-powered assistant. Enter your OpenAI API key in settings to start chatting."
  );

  chatForm.addEventListener("submit", onSubmitMessage);
  messageInput.addEventListener("keydown", handleKeydown);
  settingsForm.addEventListener("submit", onSaveSettings);
  resetSettings.addEventListener("click", onResetSettings);
  toggleSettings.addEventListener("click", onToggleSettings);
}

function onSubmitMessage(event) {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  if (!settings.apiKey) {
    renderInfoMessage(
      "system",
      "Please add your OpenAI API key in the settings panel before sending messages."
    );
    return;
  }

  appendMessage("user", message);
  messageInput.value = "";
  messageInput.focus();

  sendToChatGPT(message).catch((error) => {
    console.error(error);
    const message =
      "We hit an issue reaching OpenAI. Check your network connection, API key, and usage limits, then try again.";
    renderInfoMessage("system", message);
  });
}

function handleKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
}

async function sendToChatGPT(message) {
  const body = {
    model: settings.model,
    messages: buildMessages(message),
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorDetails}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("No reply returned from the OpenAI API");
  }

  appendMessage("assistant", reply);
}

function buildMessages(userMessage) {
  const messages = [];

  if (settings.systemPrompt) {
    messages.push({ role: "system", content: settings.systemPrompt });
  }

  conversationHistory.forEach(({ role, content }) => {
    messages.push({ role, content });
  });

  messages.push({ role: "user", content: userMessage });

  return messages;
}

function appendMessage(role, content) {
  conversationHistory.push({ role, content });
  const message = createMessageElement(role, content);
  conversationEl.appendChild(message);
  conversationEl.scrollTop = conversationEl.scrollHeight;
}

function renderInfoMessage(role, content) {
  const message = createMessageElement(role, content, true);
  conversationEl.appendChild(message);
  conversationEl.scrollTop = conversationEl.scrollHeight;
}

function createMessageElement(role, content, isInfo = false) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.role = role;

  const avatar = node.querySelector(".avatar");
  const roleLabel = node.querySelector(".role");
  const timestamp = node.querySelector(".timestamp");
  const messageContent = node.querySelector(".message-content");

  roleLabel.textContent = role === "assistant" ? "Assistant" : role === "user" ? "You" : "System";
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (role === "assistant") {
    avatar.textContent = "AI";
  } else if (role === "user") {
    avatar.textContent = "You";
  } else {
    avatar.textContent = "ℹ";
  }

  messageContent.textContent = content;

  if (isInfo) {
    node.classList.add("info-message");
  }

  return node;
}

function onSaveSettings(event) {
  event.preventDefault();

  settings = {
    apiKey: apiKeyInput.value.trim(),
    model: modelSelect.value,
    systemPrompt: systemPromptInput.value.trim(),
    remember: rememberSettings.checked,
  };

  if (settings.remember) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  renderInfoMessage("system", "Settings saved. You can start chatting now!");
  settingsPanel.hidden = true;
  toggleSettings.setAttribute("aria-expanded", "false");
}

function onResetSettings() {
  apiKeyInput.value = "";
  modelSelect.value = "gpt-4o";
  systemPromptInput.value = "You are a helpful and knowledgeable assistant.";
  rememberSettings.checked = false;

  localStorage.removeItem(STORAGE_KEY);

  settings = {
    apiKey: "",
    model: "gpt-4o",
    systemPrompt: "You are a helpful and knowledgeable assistant.",
    remember: false,
  };

  renderInfoMessage("system", "Settings cleared. Update them before sending messages.");
}

function onToggleSettings() {
  const isHidden = settingsPanel.hidden;
  settingsPanel.hidden = !isHidden;
  toggleSettings.setAttribute("aria-expanded", String(isHidden));
}

function loadSettings() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    return JSON.parse(value);
  } catch (error) {
    console.warn("Unable to read saved settings", error);
    return null;
  }
}
