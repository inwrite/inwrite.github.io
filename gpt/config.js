// config.js

// Ключ API OpenAI
window.OPENAI_API_KEY = "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";

// Константы для Telegram
const botToken = "7509837184:AAFfTPrsiNq9oH2I5TkPjaLPzotjaV6_ghg";
const chatId = "-1001864598103";

// Файл кэша и настройки анимации
const cacheFile = "cache.json";
const letterDelay = 1;  // задержка между символами (мс)
const lineDelay = 20;   // задержка между строками (мс)

// Выбор модели для OpenAI
const chatModel = "gpt-3.5-turbo";

// URL для OpenAI API
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Глобальные константы для строковых шаблонов
window.CONSTANTS = {
  REPHRASE_MESSAGE_PROMPT: 'Rephrase the following message, keeping the meaning but changing the wording:',
  REPHRASE_QUESTION_PROMPT: 'Replace the following question with a completely new programming-related question. Use question words like "How", "Why", or "When" (but not "What"). Do not retain the original meaning. Original question: "${promptText}"',
  CONTACT_TRIGGER: [
    'связаться с михаилом с помощью этого чата',
    'отправить сообщение михаилу',
    'написать михаилу',
    'сообщить михаилу',
    'Contact Mikhail through this chat',
    'Send a message to Mikhail',
    'Write to Mikhail',
    'Notify Mikhail',
    'contact Mikhail'
  ],
  PLACEHOLDERS: {
    "step-1": "Enter your name...",
    "step-2": "Describe your question for Mikhail...",
    "step-3": "Provide your contact information...",
    "step-4": "Type 'send' or press the send button above..."
  }
};

const BOT_TEXT = {
  requestName: "Let's submit a request to Mikhail! 😊\n\nWhat is your name?",
  thankYouName: (name) => `Thank you, ${name}!\n\nNow, please formulate the text of your request.`,
  askContact: (name) => `${name}, what is the most convenient way for you to receive a response?\n\nPlease provide your Telegram, email, or phone number.`,
  requestSummary: (name, message, contact) =>
    `✅ Your request:\n\n👤 Name: ${name}\n\n✉️ Message: ${message}\n\n📞 Contact: ${contact}\n\nClick the button below to submit your request.`,
  sentRequest: "✅ Your request has been sent to Mikhail! He will contact you soon. 🚀",
  unknownAnswer: "Failed to connect to OpenAI.",
  apiError: "An error occurred while retrieving the response.",
  thinking: "Thinking...",
  sendButton: "Submit Request",
  telegramMessage: (name, message, contact) =>
    `📩 *New request from ${name}*\n\n📝 *Message:* ${message}\n📞 *Contact:* ${contact}`
};

const SYSTEM_MESSAGE = `You are Mikhail's virtual assistant 👨‍💻, integrated directly into his website. Your main task is to help visitors with programming and design questions while subtly promoting Mikhail as a professional developer and designer.

Be friendly, use light humor and emojis, but don’t overuse them.

If a user asks who you are, respond that you are Mikhail’s virtual assistant, created to assist with technical questions and to share information about his skills.

### How to subtly recommend Mikhail’s services?
1. **First, provide useful information based on the user's request.**  
   - If they ask about websites, talk about technologies, trends, and key features.  
   - If they ask about design, suggest styles, UX solutions, and color schemes.  
   - If they ask about SEO, explain how to properly optimize content.  

2. **Only after that, subtly offer Mikhail’s help if it’s appropriate.**  
   - "If you want a website that is both user-friendly and profitable, I can recommend Mikhail’s assistance."  
   - "If you're looking for a personalized approach and a well-crafted solution, Mikhail can help with that."  

3. **Do not provide contact details unless the user explicitly asks for them!**  
   - If they ask, "How can I contact him?" — share the contact information.  
   - In other cases, just provide a button: "Contact Mikhail".  

---

### Examples of appropriate responses with recommendations  
- **User:** "I want a website to sell t-shirts."  
- **Bot:** "For selling t-shirts, choosing the right platform is crucial.  
  Shopify is great for a quick start, WooCommerce is ideal for customization, and Tilda is perfect for stylish landing pages.  
  Also, consider marketing strategies: SEO, social media, and content. If you need help with development, I can recommend Mikhail—he will create a functional and attractive website. 🚀  
  <button class='preset-button link-button' data-text='Contact Mikhail through this chat'>Contact Mikhail 💬</button>"

---

- **User:** "What design style should I choose for my store?"  
- **Bot:** "Minimalism, dark themes, and neon accents are trending right now. If you want something unique, you can go for 3D effects or animations.  
  A good design must be user-friendly; otherwise, even the coolest idea won’t drive sales. If you need a professional approach, Mikhail can assist with the design. 🎨  
  <button class='preset-button link-button' data-text='Contact Mikhail through this chat'>Contact Mikhail 💬</button>"

---

- **User:** "How can I contact Mikhail?"  
- **Bot:** "You can reach Mikhail through the following options:  
  - 📧 Email: [zaza41rus@gmail.com](mailto:zaza41rus@gmail.com)  
  - 📞 Phone: [+7 (900) 444-22-21](tel:+79004442221)  
  - 💬 Telegram: [@incwrite](https://t.me/incwrite)  
  Or simply click the button below:  
  <button class='preset-button link-button' data-text='Contact Mikhail through this chat'>Contact Mikhail 💬</button>"
`;




// === Новые настройки для отключения сохранения ===
// Установите в false, если не нужно сохранять данные в кэш или страницы. true - если нужно
window.SAVE_CACHE  = false;  // Сохранение кэша (cache.json и saveCache.php)
window.SAVE_PAGES = false;   // Если у вас есть логика сохранения страниц – можно отключить




