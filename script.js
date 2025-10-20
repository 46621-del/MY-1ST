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
const sendButton = chatForm.querySelector('button[type="submit"]');

const STORAGE_KEY = "chatgpt-data-chatbot-settings";

let conversationHistory = [];
let requestInFlight = false;
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

  if (requestInFlight) {
    renderInfoMessage(
      "system",
      "Please wait for the current response to finish before sending another message."
    );
    return;
  }

  const userMessageNode = appendMessage("user", message);
  messageInput.value = "";
  messageInput.focus();

  sendToChatGPT(message).catch((error) => {
    console.error(error);
    removeLastMessageFromHistory("user");
    markMessageAsError(userMessageNode);
    renderInfoMessage("system", error.message);
  });
}

function handleKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
}

async function sendToChatGPT(message) {
  const { url, payload } = buildOpenAIRequest(message);

  setRequestInFlight(true);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const { data, rawBody } = await parseResponseBody(response);

    if (!response.ok) {
      const errorMessage = extractErrorMessage(data, response.status, rawBody);
      throw new Error(errorMessage);
    }

    const reply = extractReply(data);

    if (!reply) {
      throw new Error("The OpenAI API did not include a text reply. Try a different model or prompt.");
    }

    appendMessage("assistant", reply);
  } finally {
    setRequestInFlight(false);
  }
}

function buildOpenAIRequest(userMessage) {
  const chatMessages = buildChatMessages(userMessage);

  if (shouldUseResponses(settings.model)) {
    return {
      url: "https://api.openai.com/v1/responses",
      payload: {
        model: settings.model,
        input: chatMessages.map(({ role, content }) => ({
          role,
          content: [{ type: "text", text: content }],
        })),
      },
    };
  }

  return {
    url: "https://api.openai.com/v1/chat/completions",
    payload: {
      model: settings.model,
      messages: chatMessages,
    },
  };
}

function buildChatMessages(userMessage) {
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

function appendMessage(role, content, options = {}) {
  const message = createMessageElement(role, content, options.isInfo);
  if (!options.isInfo) {
    conversationHistory.push({ role, content });
  }
  conversationEl.appendChild(message);
  conversationEl.scrollTop = conversationEl.scrollHeight;
  return message;
}

function renderInfoMessage(role, content) {
  appendMessage(role, content, { isInfo: true });
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

function removeLastMessageFromHistory(role) {
  for (let i = conversationHistory.length - 1; i >= 0; i -= 1) {
    if (conversationHistory[i].role === role) {
      conversationHistory.splice(i, 1);
      break;
    }
  }
}

function markMessageAsError(node) {
  if (!node) return;
  node.classList.add("message-error");
  node.setAttribute("data-state", "error");

  const header = node.querySelector(".message-header");
  if (!header) return;

  let status = header.querySelector(".status-indicator");
  if (!status) {
    status = document.createElement("span");
    status.className = "status-indicator";
    header.appendChild(status);
  }

  status.textContent = "Not delivered";
  status.setAttribute("aria-label", "Message not delivered");
}

function parseResponseBody(response) {
  return response
    .text()
    .then((body) => ({ rawBody: body, data: safeJsonParse(body) }))
    .catch(() => ({ rawBody: "", data: null }));
}

function safeJsonParse(body) {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch (error) {
    console.warn("Unable to parse API response", error);
    return null;
  }
}

function extractReply(data) {
  if (!data) return null;

  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const outputText = data.output?.flatMap((item) =>
    item.content
      ?.filter((part) => part.type === "output_text" || part.type === "text")
      .map((part) => part.text)
  );

  if (outputText && outputText.length) {
    return outputText.join("\n").trim();
  }

  const chatMessage = data.choices?.[0]?.message?.content;
  if (typeof chatMessage === "string" && chatMessage.trim()) {
    return chatMessage.trim();
  }

  if (Array.isArray(chatMessage)) {
    const textParts = chatMessage
      .filter((part) => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text.trim())
      .filter(Boolean);

    if (textParts.length) {
      return textParts.join("\n");
    }
  }

  return null;
}

function extractErrorMessage(data, status, rawBody) {
  if (data?.error?.message) {
    return `OpenAI API error (${status}): ${data.error.message}`;
  }

  if (data?.message) {
    return `OpenAI API error (${status}): ${data.message}`;
  }

  if (rawBody) {
    return `OpenAI API error (${status}): ${rawBody}`;
  }

  return `OpenAI API error (${status}). Check your network connection, API key, and usage limits, then try again.`;
}

function shouldUseResponses(model) {
  return /gpt-4o/i.test(model);
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

function setRequestInFlight(isInFlight) {
  requestInFlight = isInFlight;
  sendButton.disabled = isInFlight;
  sendButton.textContent = isInFlight ? "Sending..." : "Send";
}
