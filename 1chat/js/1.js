// Функция замены {callingcontact} и {name} на значения из соответствующих полей
function replacePlaceholders(text) {
  const callingcontact = document.querySelector('input[name="callingcontact"]')?.value || "";
  const name = document.querySelector('input[name="namecontact"]')?.value || "";
  return text.replace("{callingcontact}", callingcontact).replace("{name}", name);
}

// Функция обновления состояния кнопки отправки
function updateSendButtonState() {
  const sendButton = document.getElementById("qwestions-button-send");
  const textarea = document.getElementById("textarea");
  sendButton.disabled = textarea.value.trim() === "";
}

// Функция обновления класса у body
function updateBodyClass() {
  const textarea = document.getElementById("textarea");
  const body = document.body;
  const isTextNotEmpty = textarea.value.trim() !== "";

  body.classList.toggle("go", isTextNotEmpty);
  updateSendButtonState();

  // Убираем класс "hide2" у ".qwestions-textarea.hide" при наличии "callingcontact"
  const callingContactInput = document.querySelector('input[name="callingcontact"]');
  const textareaDiv = document.querySelector(".qwestions-textarea.hide");
  if (callingContactInput && textareaDiv) {
    textareaDiv.classList.add("hide2");
  }
}

// Добавляем обработчики событий
document.getElementById("textarea").addEventListener("input", updateSendButtonState);
document.getElementById("textarea").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.getElementById("qwestions-button-send").click();
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
  }
});

// Изначальная проверка состояния
updateBodyClass();
