// config.js

(function() {
  // Задайте URL вашего PHP API (getConfig.php). Замените на реальный адрес.
  const CONFIG_URL = 'https://inwrite.org/gpt-chat/getConfig.php';

  /**
   * Функция для получения конфигурации с сервера.
   * Если запрос успешен, секреты будут установлены в window, иначе — применятся значения по умолчанию.
   */
  async function loadServerConfig() {
    try {
      const response = await fetch(CONFIG_URL);
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }
      const data = await response.json();
      // Предполагается, что сервер возвращает JSON с полями: OPENAI_API_KEY, botToken, chatId
      window.OPENAI_API_KEY = data.OPENAI_API_KEY || 'test';
      window.botToken = data.botToken || '7509837184:AAFfTPrsiNq9oH2I5TkPjaLPzotjaV6_ghg';
      window.chatId = data.chatId || '-1001864598103';
    } catch (error) {
      console.error('Не удалось загрузить конфигурацию с сервера:', error);
      // Значения по умолчанию, если сервер недоступен
      window.OPENAI_API_KEY = 'test';
      window.botToken = '7509837184:AAFfTPrsiNq9oH2I5TkPjaLPzotjaV6_ghg';
      window.chatId = '-1001864598103';
    }
  }

  // Загружаем конфигурацию с сервера и затем устанавливаем остальные параметры
  loadServerConfig().then(() => {
    // Остальные настройки, не зависящие от серверных секретов
    window.cacheFile = "cache.json";
    window.letterDelay = 1;  // задержка между символами (мс)
    window.lineDelay = 20;   // задержка между строками (мс)
    window.chatModel = "gpt-3.5-turbo";
    window.OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

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

    console.log('Конфигурация загружена:', {
      OPENAI_API_KEY: window.OPENAI_API_KEY,
      botToken: window.botToken,
      chatId: window.chatId,
      cacheFile: window.cacheFile,
      letterDelay: window.letterDelay,
      lineDelay: window.lineDelay,
      chatModel: window.chatModel,
      OPENAI_API_URL: window.OPENAI_API_URL,
      CONSTANTS: window.CONSTANTS
    });
  });
})();
