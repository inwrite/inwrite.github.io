// -----------------------------
// Модуль работы с DOM и анимациями
// -----------------------------
const DomUtils = (() => {
  // Обновление состояния кнопки отправки
  function toggleButtonState() {
    const textarea = document.getElementById("userInput");
    const button = document.getElementById("sendButtonMessage");
    button.disabled = textarea.value.trim() === "";
  }

  // Обновление класса шага на элементе body
  function updateBodyStep(step) {
    const body = document.body;
    const classesToRemove = Array.from(body.classList).filter(cls => cls.startsWith("step-"));
    classesToRemove.forEach(cls => body.classList.remove(cls));
    if (step) {
      body.classList.add("step-" + step);
    }
  }

  // Прокрутка чата к последнему сообщению
  function scrollChatToBottom() {
    const chatContainer = document.querySelector("#chatbox");
    if (!chatContainer) return;
    requestAnimationFrame(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      chatContainer.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Анимация вывода markdown-текста с подсветкой кода
  function animateMarkdownText(element, markdownText) {
    return new Promise(resolve => {
      if (typeof letterDelay === "undefined" || letterDelay === 0) {
        element.innerHTML = marked.parse(markdownText);
        element.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        resolve();
        return;
      }

      const lines = markdownText.split("\n");
      let accumulatedMarkdown = "";
      let currentLineIndex = 0;

      const updateOutput = markdown => {
        const html = marked.parse(markdown);
        element.innerHTML = html;
        element.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
      };

      // Определяем строки для мгновенного отображения
      const isInstantLine = line => {
        const trimmed = line.trim();
        return (/^\[.*?\]\(.*?\)$/.test(trimmed)) ||
          trimmed.startsWith("<video") ||
          trimmed.startsWith("<iframe") ||
          trimmed.startsWith("<button") ||
          trimmed.startsWith("![") ||
          trimmed.startsWith("<form") ||
          trimmed.startsWith("<input") ||
          trimmed.startsWith("<textarea") ||
          trimmed.startsWith("<label") ||
          trimmed.startsWith("<svg") || // здесь svg отмечается для мгновенного отображения
          trimmed.startsWith("<script") ||
          trimmed.startsWith("<a");
      };

      const animateLine = (line, callback) => {
        let currentCharIndex = 0;
        const typeChar = () => {
          if (currentCharIndex < line.length) {
            const animatedLine = line.substring(0, currentCharIndex + 1);
            updateOutput(accumulatedMarkdown + animatedLine);
            currentCharIndex++;
            setTimeout(typeChar, letterDelay);
          } else {
            callback();
          }
        };
        typeChar();
      };

      const processInstantBlock = endTag => {
        const blockLines = [];
        while (currentLineIndex < lines.length) {
          const currentLine = lines[currentLineIndex];
          blockLines.push(currentLine);
          currentLineIndex++;
          if (currentLine.includes(endTag)) break;
        }
        return blockLines.join("\n") + "\n";
      };

      const processLine = () => {
        if (currentLineIndex >= lines.length) {
          updateOutput(accumulatedMarkdown);
          resolve();
          return;
        }
        const line = lines[currentLineIndex];
        const trimmed = line.trim();

        if (isInstantLine(line)) {
          if (trimmed.startsWith("<video")) {
            accumulatedMarkdown += processInstantBlock("</video>");
          } else if (trimmed.startsWith("<iframe")) {
            if (!trimmed.includes("</iframe>")) {
              accumulatedMarkdown += processInstantBlock("</iframe>");
            } else {
              accumulatedMarkdown += line + "\n";
              currentLineIndex++;
            }
          } else if (trimmed.startsWith("<button")) {
            if (!trimmed.includes("</button>")) {
              accumulatedMarkdown += processInstantBlock("</button>");
            } else {
              accumulatedMarkdown += line + "\n";
              currentLineIndex++;
            }
          } else if (trimmed.startsWith("<form")) {
            accumulatedMarkdown += processInstantBlock("</form>");
          } else if (trimmed.startsWith("<svg")) {  // Если строка начинается с <svg, обрабатываем блок до </svg>
            accumulatedMarkdown += processInstantBlock("</svg>");
          } else if (
            trimmed.startsWith("<input") ||
            trimmed.startsWith("<textarea") ||
            trimmed.startsWith("<label") ||
            trimmed.startsWith("<script") ||
            trimmed.startsWith("<a") ||
            /^\[.*?\]\(.*?\)$/.test(trimmed) ||
            trimmed.startsWith("![")
          ) {
            accumulatedMarkdown += line + "\n";
            currentLineIndex++;
          }
          updateOutput(accumulatedMarkdown);
          setTimeout(processLine, lineDelay);
          return;
        }

        animateLine(line, () => {
          accumulatedMarkdown += line + "\n";
          updateOutput(accumulatedMarkdown);
          currentLineIndex++;
          setTimeout(processLine, lineDelay);
        });
      };

      processLine();
    });
  }

  // Анимация вывода HTML с немедленным отображением некоторых тегов
  function animateHTML(element, html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    element.innerHTML = "";
    const instantTags = ["IMG", "VIDEO", "A", "BUTTON", "SVG"];

    function animateNode(node, parent) {
      if (node.nodeType === Node.TEXT_NODE) {
        const span = document.createElement("span");
        parent.appendChild(span);
        animateText(span, node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = document.createElement(node.tagName);
        for (const attr of node.attributes) {
          el.setAttribute(attr.name, attr.value);
        }
        parent.appendChild(el);
        if (instantTags.includes(node.tagName.toUpperCase())) {
          el.innerHTML = node.innerHTML;
        } else {
          node.childNodes.forEach(child => animateNode(child, el));
        }
      }
    }

    function animateText(span, text, index = 0) {
      if (index < text.length) {
        span.textContent += text[index];
        setTimeout(() => animateText(span, text, index + 1), 50);
      }
    }

    doc.body.childNodes.forEach(child => animateNode(child, element));
  }

  // Вывод текста с эффектом печати
  async function typeText(element, text) {
    document.body.classList.add('type-txt');
    await animateMarkdownText(element, text);
    document.body.classList.remove('type-txt');
    document.getElementById("userInput").focus();
  }

  return {
    toggleButtonState,
    updateBodyStep,
    scrollChatToBottom,
    animateMarkdownText,
    animateHTML,
    typeText
  };
})();


// -----------------------------
// Модуль для работы с API (OpenAI, Telegram)
// -----------------------------
const ApiModule = (() => {
  let apiKey = window.OPENAI_API_KEY;
  let apiAvailable = false;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Проверка доступности API OpenAI и управление классом на body
  async function checkAPI() {
    await delay(100);
    apiKey = window.OPENAI_API_KEY;
    if (!apiKey) {
      document.body.classList.add("failedOpenAI");
      return;
    }
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: chatModel,
          messages: [{ role: "user", content: "Проверка подключения" }],
          temperature: 0
        })
      });
      if (response.ok) {
        apiAvailable = true;
        document.body.classList.remove("failedOpenAI");
      } else {
        document.body.classList.add("failedOpenAI");
      }
    } catch (error) {
      document.body.classList.add("failedOpenAI");
    }
  }

  // Динамическое перефразирование текста через OpenAI
  async function getDynamicText(originalText, { skip = false } = {}) {
    if (skip || !apiAvailable) return originalText;
    try {
      const prompt = `${window.CONSTANTS.REPHRASE_MESSAGE_PROMPT}\n\n"${originalText}"`;
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: chatModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8
        })
      });
      if (!response.ok) return originalText;
      const data = await response.json();
      let dynamicText = data.choices?.[0]?.message?.content || originalText;
      dynamicText = TextUtils.stripQuotes(dynamicText.trim());
      return dynamicText;
    } catch (error) {
      return originalText;
    }
  }

  // Генерация нового варианта вопроса для кнопок
  async function generateVariant(promptText) {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: chatModel,
          messages: [{
            role: "user",
            content: `${window.CONSTANTS.REPHRASE_QUESTION_PROMPT} "${promptText}"`
          }],
          temperature: 0.8
        })
      });
      if (!response.ok) return promptText;
      const data = await response.json();
      let newText = data.choices?.[0]?.message?.content || promptText;
      newText = TextUtils.stripQuotes(newText.trim());
      return newText;
    } catch (error) {
      return promptText;
    }
  }

  // Отправка сообщения в Telegram через Bot API
  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" })
      });
      if (!response.ok) throw new Error("Ошибка при отправке в Telegram");
    } catch (error) {
      // Можно логировать ошибку отправки
    }
  }

  return {
    checkAPI,
    getDynamicText,
    generateVariant,
    sendToTelegram,
    isApiAvailable: () => apiAvailable
  };
})();


// -----------------------------
// Модуль текстовых утилит
// -----------------------------
const TextUtils = (() => {
  // Удаляет обрамляющие кавычки из строки
  function stripQuotes(text) {
    if (
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith('«') && text.endsWith('»'))
    ) {
      return text.slice(1, -1).trim();
    }
    return text;
  }

  // Определяет язык кода по содержимому текста
  function detectCodeLanguage(text) {
    const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
    if (htmlTagRegex.test(text)) return "html";
    if (/def\s+|import\s+|print\(/.test(text)) return "python";
    if (/function\s+|const\s+|let\s+|var\s+/.test(text)) return "javascript";
    if (/\{[\s\S]*\}/.test(text)) return "css";
    return null;
  }

  // Оборачивает код в markdown‑код-блок, если язык определён
  function processUserMessage(text) {
    const detectedLanguage = detectCodeLanguage(text);
    if (detectedLanguage) {
      return "```" + detectedLanguage + "\n" + text + "\n```";
    }
    return text;
  }

  return {
    stripQuotes,
    detectCodeLanguage,
    processUserMessage
  };
})();


// -----------------------------
// Модуль логики чата и управления состоянием
// -----------------------------
const ChatModule = (() => {
  let faqData = [];
  let cacheData = {};
  const chatState = {};

  // Загрузка FAQ из файла data.json
  async function loadFAQ() {
    try {
      const response = await fetch("index-file/data.json");
      faqData = await response.json();
    } catch (error) {
      // Можно логировать ошибку загрузки FAQ
    }
  }

  // Загрузка кэша из файла (если включено)
  async function loadCache() {
    if (!window.SAVE_CACHE) {
      cacheData = {};
      return;
    }
    try {
      const response = await fetch(cacheFile);
      cacheData = await response.json();
    } catch (error) {
      cacheData = {};
    }
  }

  // Сохранение кэша через saveCache.php
  async function saveCache(question, answer) {
    if (!window.SAVE_CACHE) return;
    cacheData[question.toLowerCase()] = answer;
    try {
      await fetch("index-file/saveCache.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer })
      });
    } catch (error) {
      // Можно логировать ошибку сохранения кэша
    }
  }

  // Вычисление схожести двух строк по общим словам
  function getSimilarity(str1, str2) {
    const words1 = str1.split(" ");
    const words2 = str2.split(" ");
    const matchCount = words1.filter(word => words2.includes(word)).length;
    return matchCount / Math.max(words1.length, words2.length);
  }

  // Поиск лучшего совпадения в FAQ
  function findBestMatch(userQuestion) {
    const userLower = userQuestion.toLowerCase();

    // Сначала по ключевым словам
    for (const item of faqData) {
      if (item.keywords) {
        for (const kw of item.keywords) {
          const kwLower = kw.toLowerCase();
          const words = kwLower.split(" ");
          if (words.every(word => userLower.includes(word))) {
            return item;
          }
        }
      }
    }

    // Затем по схожести полного вопроса
    let bestMatch = null;
    let bestSimilarity = 0;
    faqData.forEach(item => {
      const similarity = getSimilarity(userLower, item.question.toLowerCase());
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = item;
      }
    });

    return bestSimilarity > 0.7 ? bestMatch : null;
  }

  // Обработка отправки заявки (финальный шаг)
  async function handleSubmitRequest(userId) {
    if (!chatState[userId] || chatState[userId].step !== 4) return;
    const userState = chatState[userId];
    const originalTelegramMessage = BOT_TEXT.telegramMessage(
      userState.data.name,
      userState.data.message,
      userState.data.contact
    );
    const telegramMessage = await ApiModule.getDynamicText(originalTelegramMessage);
    await ApiModule.sendToTelegram(telegramMessage);

    DomUtils.updateBodyStep("");
    delete chatState[userId];

    const chatbox = document.getElementById("chatbox");
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot", "sent-message");
    botMessage.innerHTML = await ApiModule.getDynamicText(BOT_TEXT.sentRequest);
    chatbox.appendChild(botMessage);

    const sendButton = document.getElementById("sendRequestButton");
    if (sendButton) sendButton.remove();
  }

  // Отображение кнопки отправки заявки
  async function displaySendButton(userId) {
    const chatBox = document.getElementById("chatbox");
    const oldButton = document.getElementById("sendRequestButton");
    if (oldButton) oldButton.remove();

    const button = document.createElement("button");
    button.id = "sendRequestButton";
    button.classList.add("send-button", "btn-primary");
    const staticText = button.getAttribute("data-text");
    button.innerText = staticText || await ApiModule.getDynamicText(BOT_TEXT.sendButton);
    button.onclick = () => handleSubmitRequest(userId);
    chatBox.appendChild(button);
  }

  // Функция отмены текущих шагов диалога
  function cancelSteps(userId) {
    if (chatState[userId]) {
      delete chatState[userId];
      DomUtils.updateBodyStep('');
      const sendButton = document.getElementById("sendRequestButton");
      if (sendButton) sendButton.remove();
    }
  }

  // Основная функция обработки сообщений пользователя
  async function processMessage(message) {
    const chatbox = document.getElementById("chatbox");
    const messageBlock = document.createElement("div");
    messageBlock.classList.add("message-block");
    chatbox.appendChild(messageBlock);

    // Вывод сообщения пользователя
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");
    const processedMessage = TextUtils.processUserMessage(message);
    userMessage.innerHTML = marked.parse(processedMessage);
    userMessage.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    messageBlock.appendChild(userMessage);

    // Очистка поля ввода и обновление кнопки
    const input = document.getElementById("userInput");
    input.value = "";
    DomUtils.toggleButtonState();

    // Создание блока для ответа бота
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot");
    messageBlock.appendChild(botMessage);
    DomUtils.scrollChatToBottom();

    const userId = "default";
    if (!chatState[userId]) {
      chatState[userId] = { step: 0, data: {} };
    }
    const userState = chatState[userId];

    const messageLower = message.toLowerCase();
    let triggerFound = false;
    if (Array.isArray(window.CONSTANTS.CONTACT_TRIGGER)) {
      triggerFound = window.CONSTANTS.CONTACT_TRIGGER.some(trigger =>
        messageLower.includes(trigger.toLowerCase())
      );
    } else {
      triggerFound = messageLower.includes(window.CONSTANTS.CONTACT_TRIGGER.toLowerCase());
    }

    // Обработка шагов диалога как конечного автомата
    if (triggerFound && userState.step === 0) {
      userState.step = 1;
      DomUtils.updateBodyStep(userState.step);
      await DomUtils.typeText(botMessage, await ApiModule.getDynamicText(BOT_TEXT.requestName));
      return;
    }
    if (userState.step === 1) {
      userState.data.name = message;
      userState.step = 2;
      DomUtils.updateBodyStep(userState.step);
      await DomUtils.typeText(botMessage, await ApiModule.getDynamicText(BOT_TEXT.thankYouName(userState.data.name)));
      return;
    }
    if (userState.step === 2) {
      userState.data.message = message;
      userState.step = 3;
      DomUtils.updateBodyStep(userState.step);
      await DomUtils.typeText(botMessage, await ApiModule.getDynamicText(BOT_TEXT.askContact(userState.data.name)));
      return;
    }
    if (userState.step === 3) {
      userState.data.contact = message;
      userState.step = 4;
      DomUtils.updateBodyStep(userState.step);
      await DomUtils.typeText(
        botMessage,
        await ApiModule.getDynamicText(BOT_TEXT.requestSummary(
          userState.data.name,
          userState.data.message,
          userState.data.contact
        ))
      );
      await displaySendButton(userId);
      return;
    }
    if (userState.step === 4 && message.toLowerCase() === "send") {
      await handleSubmitRequest(userId);
      DomUtils.updateBodyStep("");
      return;
    }

    // Поиск совпадений в FAQ
    const match = findBestMatch(message);
    if (match) {
      const answer = await ApiModule.getDynamicText(match.answer, { skip: true });
      await DomUtils.typeText(botMessage, answer);
      await saveCache(message, answer);
      return;
    }
    if (cacheData[message.toLowerCase()]) {
      await DomUtils.typeText(botMessage, await ApiModule.getDynamicText(cacheData[message.toLowerCase()]));
      return;
    }
    if (!ApiModule.isApiAvailable()) {
      await DomUtils.typeText(botMessage, BOT_TEXT.unknownAnswer);
      return;
    }

    botMessage.innerHTML = `<span class="loading-shimmer">${await ApiModule.getDynamicText(BOT_TEXT.thinking)}</span>`;
    DomUtils.scrollChatToBottom();

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: chatModel,
          messages: [
            { role: "system", content: SYSTEM_MESSAGE },
            { role: "user", content: message }
          ],
          temperature: 0.8
        })
      });
      const data = await response.json();
      let reply = data.choices?.[0]?.message?.content || BOT_TEXT.unknownAnswer;
      reply = TextUtils.stripQuotes(reply.replace(/#[^\s]+/g, "").trim());
      await DomUtils.typeText(botMessage, await ApiModule.getDynamicText(reply));
      await saveCache(message, reply);
    } catch (error) {
      await DomUtils.typeText(botMessage, await ApiModule.getDynamicText(BOT_TEXT.apiError));
    }
  }

  return {
    init: async () => {
      await ApiModule.checkAPI();
      await loadFAQ();
      await loadCache();
    },
    processMessage,
    cancelSteps // функция для отмены шагов
  };
})();


// -----------------------------
// Обработчики событий и инициализация
// -----------------------------
// Отслеживание изменений в textarea
document.getElementById("userInput").addEventListener("input", DomUtils.toggleButtonState);
document.getElementById("userInput").addEventListener("paste", () => {
  setTimeout(DomUtils.toggleButtonState, 10);
});

// Делегирование кликов для кнопок с классом preset-button
document.addEventListener("click", async e => {
  const button = e.target.closest(".preset-button");
  if (button) {
    const presetText = button.getAttribute("data-text");
    const inputField = document.getElementById("userInput");
    if (inputField) {
      inputField.value = presetText;
      DomUtils.toggleButtonState();
      if (!button.classList.contains("not-send")) {
        await ChatModule.processMessage(presetText);
        inputField.value = "";
        DomUtils.toggleButtonState();
      }
    }
  }
});

// Обработчик клика по кнопке отправки сообщения
document.getElementById("sendButtonMessage").addEventListener("click", async () => {
  const inputField = document.getElementById("userInput");
  if (inputField && inputField.value.trim()) {
    await ChatModule.processMessage(inputField.value.trim());
  }
});

// Обработчик клика по кнопке отмены шагов
document.getElementById("cancelStepsButton").addEventListener("click", () => {
  ChatModule.cancelSteps("default");
  const chatbox = document.getElementById("chatbox");
  const cancelMessage = document.createElement("div");
  cancelMessage.classList.add("message", "bot", "cancelled-message");
  cancelMessage.innerHTML = "The operation has been cancelled.";
  chatbox.appendChild(cancelMessage);
});

// Инициализация модулей
(async () => {
  await ChatModule.init();
})();

// Генерация новых вариантов для кнопок внутри .help-div
(async function() {
  const buttons = document.querySelectorAll('.help-div button.preset-button');
  for (const button of buttons) {
    const originalText = button.getAttribute("data-text");
    const newText = await ApiModule.generateVariant(originalText);
    button.setAttribute("data-text", newText);
    const span = button.querySelector("span");
    if (span) {
      span.textContent = newText;
    }
  }
})();
