// Массивы с вариантами сообщений
const messages = {
  contact: [
    "<strong>Contact me directly via Telegram Messenger</strong> for a prompt response...\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a>\nIf Telegram is not available, use the form below.",
    // другие сообщения...
  ],
  ukrain: [
    "I firmly stand with Ukraine and strongly condemn the actions of the current Russian government...\n<a href='https://www.instagram.com/p/C9KAuhJo4VF/?hl=en&img_index=8' target='_blank'>link on Instagram</a>."
  ],
  tempmail: ["<div class='temp-mail'></div>"],
  personal: [
    "<strong>I am a web developer specializing in supporting small businesses...</strong>",
    // другие сообщения...
  ],
  unknown: ["Запрос нераспознан. Пожалуйста, уточните или используйте предложения."],
  firstStage: {
    DefaultMessagevalidKeywords: [
      "<strong>Свяжитесь со мной напрямую через Telegram Messenger</strong> для быстрого ответа на ваши вопросы.\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a>\n<strong>Для начала скажите, как я могу к вам обращаться?</strong>"
    ]
  },
  secondStage: [
    "<strong>Рад знакомству, {name}! Опишите, что требуется...</strong>\n<blockquote>For example: Привет Михаил!...</blockquote>"
  ],
  thirdStage: [
    "<strong>Принято, {name}! Куда я могу вам ответить?</strong>\n<ul><li>E-mail — <strong>example@domain.com</strong></li></ul>"
  ],
  fourthStage: [
    "<strong>Thank you, {name}!</strong>\nI'm now preparing the message for sending..."
  ],
  sendSuccess: [
    "<div class='flex'><div class='flex-icon'></div><div class='flex-text'>Message sent, <strong>{name}!</strong> via <strong>{contact}</strong>.</div></div>"
  ],
  sendError: [
    "<div class='flex'><div class='flex-icon'></div><div class='flex-text'>Unfortunately, <strong>{name}</strong>, there was an error. Try Telegram Messenger.</div></div>\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a>"
  ]
};

// Универсальная функция для получения случайного сообщения
function getRandomMessage(category, name = "", contact = "") {
  const messageArray = Array.isArray(messages[category]) 
    ? messages[category] 
    : messages[category]?.DefaultMessagevalidKeywords || [];

  const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
  return randomMessage.replace("{name}", name).replace("{contact}", contact);
}

// Специальные функции для этапов и ошибок
function getRandomFirstStageMessage(keyword = "DefaultMessagevalidKeywords") {
  const messageArray = messages.firstStage[keyword] || messages.firstStage.DefaultMessagevalidKeywords;
  return messageArray[Math.floor(Math.random() * messageArray.length)];
}

function getRandomSecondStageMessage(name) {
  return getRandomMessage("secondStage", name);
}

function getRandomThirdStageMessage(name, contact) {
  return getRandomMessage("thirdStage", name, contact);
}

function getRandomFourthStageMessage(name, contact) {
  return getRandomMessage("fourthStage", name, contact);
}

function getRandomSendSuccessMessage(name, contact) {
  return getRandomMessage("sendSuccess", name, contact);
}

function getRandomSendErrorMessage(name, contact) {
  return getRandomMessage("sendError", name, contact);
}
