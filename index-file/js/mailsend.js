const TOKENcontact =
"528665965985928:AAEKRlgbGfriree74O4U3jq3SFW0AL8O_4E12pe-"
  .substring(5)
  .slice(0, -5),
CHAT_IDcontact = "-10018645981036".slice(0, -1),
URI_APIcontact = `https://api.telegram.org/bot${TOKENcontact}/sendMessage`,
SUCCESScontact = document.getElementById("successcontact"),
HONEYPOTcontact = document.getElementById("honeypotcontact"),
FORMHIDEcontact = document.querySelector("details.contact-chtML > div");

// Функция для добавления обработчика события отправки формы
function addFormSubmitHandler() {
const form = document.getElementById("tgcontact");
if (form) {
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Проверка honeypot (проверка на бота)
  if (document.getElementById("usercodecontact").value.length) {
    if (HONEYPOTcontact) {
      HONEYPOTcontact.innerHTML = "Not human";
      HONEYPOTcontact.style.display = "block";
    }
    return false;
  }

  // Формирование сообщения для отправки в Telegram
  let tcontact = "<b>Message User</b>\n";
  tcontact += `<b>Name: </b> ${this.namecontact.value}\n`;
  tcontact += `<b>Calling: </b> ${this.contactinfo.value}\n`;
  tcontact += `<b>Text: </b> ${this.textareacontact.value}\n`;

  // Отправка данных через API Telegram
  axios
    .post(URI_APIcontact, {
      chat_id: CHAT_IDcontact,
      parse_mode: "html",
      text: tcontact,
    })
    .then((response) => {
      // // Искусственно вызываем ошибку
      // throw new Error("Тестовая ошибка отправки");

      // Проверяем наличие элемента SUCCESScontact перед его использованием
      if (SUCCESScontact) {
        this.namecontact.value = "";
        this.contactinfo.value = "";
        this.textareacontact.value = "";
      }

      // Проверяем наличие элемента FORMHIDEcontact перед его использованием
      if (FORMHIDEcontact) {
        FORMHIDEcontact.style.display = "none";
      }

      // Добавляем класс .sendok к тегу body
      document.body.classList.add("sendok");

      // Добавляем класс .success к div.send-time
      const sendTimeDiv = document.querySelector(".send-time");
      if (sendTimeDiv) {
        sendTimeDiv.classList.add("success");

        // Очищаем содержимое перед добавлением эффекта печатной машинки
        sendTimeDiv.innerHTML = "";

        // Создаём нужную структуру
        const inputGroupAnswerDiv = document.createElement("div");
        inputGroupAnswerDiv.classList.add("input-group-answer");
        const typewriter = document.createElement("p");
        typewriter.classList.add("typewriter");
        inputGroupAnswerDiv.appendChild(typewriter);
        sendTimeDiv.appendChild(inputGroupAnswerDiv);

        // Задержка перед началом печати (3 секунды)
        setTimeout(() => {
          // Получение случайного сообщения
          const name = form.querySelector(
            'input[name="namecontact"]'
          ).value;
          const contact = form.querySelector(
            'input[name="contactinfo"]'
          ).value;
          const message = getRandomMessage("sendSuccess", name, contact);
          // Используем startTypewriterEffect для вывода успешного сообщения
          startTypewriterEffect(typewriter, `${message}`);
        }, 3000); // 3000 миллисекунд = 3 секунды
      }
    })
    .catch((error) => {
      // Обработка ошибки с детализированной информацией
      console.error(
        "Error occurred: ",
        error.response ? error.response.data : error.message
      );

      // Добавляем класс .error к div.send-time
      const sendTimeDiv = document.querySelector(".send-time");
      if (sendTimeDiv) {
        sendTimeDiv.classList.add("error");

        // Очищаем содержимое перед добавлением эффекта печатной машинки
        sendTimeDiv.innerHTML = "";

        // Создаём нужную структуру
        const inputGroupAnswerDiv = document.createElement("div");
        inputGroupAnswerDiv.classList.add("input-group-answer");
        const typewriter = document.createElement("p");
        typewriter.classList.add("typewriter");
        inputGroupAnswerDiv.appendChild(typewriter);
        sendTimeDiv.appendChild(inputGroupAnswerDiv);

        // Задержка перед началом печати (3 секунды)
        setTimeout(() => {
          // Получение случайного сообщения
          const name = form.querySelector(
            'input[name="namecontact"]'
          ).value;
          const contact = form.querySelector(
            'input[name="contactinfo"]'
          ).value;

          const message = getRandomMessage("sendError", name, contact);
          // Используем startTypewriterEffect для вывода успешного сообщения
          startTypewriterEffect(typewriter, `${message}`);
        }, 3000); // 3000 миллисекунд = 3 секунды
      }
    })
    .finally(() => {
      console.log("end");
    });
});
}
}

// Используем MutationObserver для отслеживания добавления формы на страницу
const observer = new MutationObserver((mutationsList) => {
for (let mutation of mutationsList) {
if (mutation.type === "childList") {
  const form = document.getElementById("tgcontact");
  if (form) {
    // Форма найдена, добавляем обработчик
    addFormSubmitHandler();
    // Прекращаем наблюдение после добавления обработчика
    observer.disconnect();
    break;
  }
}
}
});

// Настраиваем наблюдатель для контейнера .messege
observer.observe(document.querySelector(".messege"), {
childList: true,
subtree: true,
});