function addCountdownAndAutoSubmit(element) {
  if (!element) return;

  // Создаём div для таймера и кнопку отправки
  const sendTimeDiv = document.createElement("div");
  sendTimeDiv.classList.add("send-time");

  const sendButton = document.createElement("button");
  sendButton.type = "submit";
  sendButton.name = "sendmessage";
  sendButton.classList.add("Button", "default", "primary", "text");
  sendButton.style.display = "none";
  sendButton.textContent = "Send Message";
  sendTimeDiv.appendChild(sendButton);

  const form = document.getElementById("tgcontact");
  if (form) form.appendChild(sendTimeDiv);

  // Таймер для автоматического нажатия кнопки через 1 секунду
  setTimeout(() => sendButton.click(), 1000);
}

function observeSendTimeElement() {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && document.querySelector(".send-time")) {
        document.body.classList.add("sending");
        observer.disconnect();
        break;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Запуск наблюдения
observeSendTimeElement();
