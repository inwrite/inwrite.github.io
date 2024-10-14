const TOKENcontact = "528665965985928:AAEKRlgbGfriree74O4U3jq3SFW0AL8O_4E12pe-".substring(5).slice(0, -5),
      CHAT_IDcontact = "-10018645981036".slice(0, -1),
      URI_APIcontact = `https://api.telegram.org/bot${TOKENcontact}/sendMessage`,
      SUCCESScontact = document.getElementById("successcontact"),
      HONEYPOTcontact = document.getElementById("honeypotcontact"),
      FORMHIDEcontact = document.querySelector("details.contact-chtML > div");

document.getElementById("tgcontact").addEventListener("submit", function(e) {
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
    tcontact += `<b>Calling: </b> ${this.callingcontact.value}\n`;
    tcontact += `<b>Text: </b> ${this.textareacontact.value}\n`;

    // Отправка данных через API Telegram
    axios.post(URI_APIcontact, {
        chat_id: CHAT_IDcontact,
        parse_mode: "html",
        text: tcontact
    }).then((response) => {
        // Проверяем наличие элемента SUCCESScontact перед его использованием
        if (SUCCESScontact) {
            this.namecontact.value = "";
            this.callingcontact.value = "";
            this.textareacontact.value = "";
            // SUCCESScontact.innerHTML = "Your message has been sent 👍 <br> I will try to answer it as soon as possible 😀";
            // SUCCESScontact.style.display = "block";
        }

        // Проверяем наличие элемента FORMHIDEcontact перед его использованием
        if (FORMHIDEcontact) {
            FORMHIDEcontact.style.display = "none";
        }

        // Добавляем класс .sendok к тегу body
        document.body.classList.add("sendok");
    }).catch((error) => {
        // Обработка ошибки с детализированной информацией
        console.error("Error occurred: ", error.response ? error.response.data : error.message);
    }).finally(() => {
        console.log("end");
    });
});