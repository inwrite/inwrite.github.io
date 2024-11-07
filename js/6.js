document
.getElementById("qwestions-button-send")
.addEventListener("click", function () {
  const textarea = document.getElementById("textarea");
  const messageDiv = document.querySelector(".messege");

  const personalKeywords = [
    "portfolio",
    "tell me",
    "about yourself",
    "who are you",
    "tell me about yourself",
    "what do you do",
    "your experience",
    "who are you",
    "what is your job",
    "what do you do",
    "work experience",
    "your profession",
    "what are you doing",
    "your job",
    "your background",
    "your profession",
    "what can you do",
    "specialization",
    "profile",
    "describe yourself",
    "a few words about yourself",
    "who are you",
    "what are you like",
    "what can you offer",
    "what is your expertise",
    "your resume",
    "your background",
    "who i am",
    "what is your experience",
  ];

  const ukrainKeywords = [
    "ukraine",
    "war in ukraine",
    "war",
    "russian invasion",
    "ukrainian conflict",
    "support ukraine",
    "help ukraine",
    "stand with ukraine",
    "ukrainian resistance",
    "ukrainian army",
    "russian aggression",
    "stop the war",
    "peace for ukraine",
    "ukraine crisis",
    "donate to ukraine",
    "ukrainian sovereignty",
    "free ukraine",
    "ukrainian freedom",
    "ukrainian independence",
    "save ukraine",
    "kyiv bombing",
    "ukraine solidarity",
    "humanitarian aid ukraine",
    "war crimes russia",
    "ukrainian civilians",
    "support ukrainian people",
  ];

  const contactKeywords = [
    "contact",
    "get in touch",
    "connection",
    "contacts",
    "contact information",
    "how to find",
    "contact details",
    "available contacts",
    "ways to contact",
    "where to find",
    "how to get in touch",
    "contact number",
    "contact email",
    "how to write",
    "how to call",
    "how to ask a question",
    "how to send a message",
    "how to write to you",
    "want to contact",
    "how can I reach you",
    "find you",
  ];

  const validKeywords = [
    "wordpress",
    "need",
    "consultation",
    "make",
    "help",
    "support",
    "feedback",
    "question",
    "request",
    "order",
    "want to know",
    "need advice",
    "need help",
    "ask a question",
    "how to order",
    "how to get help",
    "want to discuss",
    "for consultation",
    "want to make",
  ];

  const tempmailKeywords = [
  "mail",
  ];

  const clearKeywords = [
  "clear",
  ];

  function containsValidKeywords(text, keywords) {
    return keywords.some((keyword) => text.toLowerCase().includes(keyword));
  }

  function displayUserMessageAndResponse(userMessage, responseMessage) {
    const inputGroupDiv = document.createElement("div");
    inputGroupDiv.classList.add("input-group");

    const userMessageElement = document.createElement("p");
    userMessageElement.classList.add("user-messege");
    userMessageElement.innerHTML = userMessage.replace(/\n/g, "<br>");

    inputGroupDiv.appendChild(userMessageElement);

    const inputGroupAnswerDiv = document.createElement("div");
    inputGroupAnswerDiv.classList.add("input-group-answer");
    const typewriter = document.createElement("p");
    typewriter.classList.add("typewriter");
    inputGroupAnswerDiv.appendChild(typewriter);

    inputGroupDiv.appendChild(inputGroupAnswerDiv);

    // Проверяем, существует ли форма, и добавляем элемент после формы
    const form = document.getElementById("tgcontact");
    if (form) {
      form.insertAdjacentElement("afterend", inputGroupDiv); // Добавляем сообщение после формы
    } else {
      messageDiv.appendChild(inputGroupDiv); // Если формы нет, добавляем в конец messageDiv
    }

    startTypewriterEffect(typewriter, responseMessage);
  }




  function clearMessages() {
  if (messageDiv) {
    messageDiv.innerHTML = ""; // Очищаем содержимое
  }
  document.body.className = ""; // Удаляем все классы у body
}



  const textareaValue = textarea.value.trim();

      // Проверка на ключевые слова для очистки
if (containsValidKeywords(textareaValue, clearKeywords)) {
  clearMessages();
  textarea.value = "";
  textarea.focus();
  updateBodyClass();
  updateSendButtonState();
  return;
}


  // Проверка на контактные ключевые слова
  if (containsValidKeywords(textareaValue, contactKeywords)) {
    const contactMessage = getRandomMessage("contact");
    displayUserMessageAndResponse(textareaValue, contactMessage);

    document.body.classList.add("contactMessage");
    textarea.value = "";
    textarea.focus();
    updateBodyClass();
    updateSendButtonState();
    return;
  }

  // Проверка на ключевые слова для персонального сообщения
  if (containsValidKeywords(textareaValue, personalKeywords)) {
    const personalMessage = getRandomMessage("personal");
    displayUserMessageAndResponse(textareaValue, personalMessage);

    document.body.classList.add("personalMessage");
    textarea.value = "";
    textarea.focus();
    updateBodyClass();
    updateSendButtonState();
    return;
  }

  // Проверка на ключевые слова для украинского сообщения
  if (containsValidKeywords(textareaValue, ukrainKeywords)) {
    // const ukrainMessage = getRandomUkrainMessage();
    const ukrainMessage = getRandomMessage("ukrain");
    displayUserMessageAndResponse(textareaValue, ukrainMessage);

    document.body.classList.add("ukrainMessage");
    textarea.value = "";
    textarea.focus();
    updateBodyClass();
    updateSendButtonState();
    return;
  }






  // Проверка на ключевые слова для tempmail
  if (containsValidKeywords(textareaValue, tempmailKeywords)) {
    const tempmailMessage = getRandomMessage("tempmail");
    displayUserMessageAndResponse(textareaValue, tempmailMessage);

    document.body.classList.add("tempmailMessage");
    textarea.value = "";
    textarea.focus();
    updateBodyClass();
    updateSendButtonState();
    return;
  }



















  
  // Создание формы, если есть валидные ключевые слова
  let form = document.getElementById("tgcontact");
  if (containsValidKeywords(textareaValue, validKeywords) && !form) {
    form = document.createElement("form");
    form.id = "tgcontact";
    messageDiv.appendChild(form);
  }

  // Проверка на наличие формы и переход к этапам заполнения
  if (form) {
    const inputGroups = form.querySelectorAll(".input-group");

    // Этап 1: Ввод задания
    if (
      inputGroups.length === 0 &&
      containsValidKeywords(textareaValue, validKeywords)
    ) {
      document.body.classList.remove("two", "three", "four"); // Удаление других классов
      document.body.classList.add("one"); // Добавляем класс "one"
      let  firstStageMessage = getRandomFirstStageMessage("DefaultMessagevalidKeywords");
      // let  firstStageMessage =  "Это этап 1";


      document.body.classList.add("sendMessage");

      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.classList.add("input-group");

      const userMessage = document.createElement("p");
      userMessage.classList.add("user-messege");
      userMessage.textContent = textareaValue;

      inputGroupDiv.appendChild(userMessage);
      form.appendChild(inputGroupDiv);

      const inputGroupAnswerDiv = document.createElement("div");
      inputGroupAnswerDiv.classList.add("input-group-answer");
      const typewriter = document.createElement("p");
      typewriter.classList.add("typewriter");
      inputGroupAnswerDiv.appendChild(typewriter);
      form.appendChild(inputGroupAnswerDiv);

      startTypewriterEffect(typewriter, firstStageMessage);
    }





    // Этап 2: Ввод имени
    if (inputGroups.length === 1 && textareaValue !== "") {
      document.body.classList.remove("one", "three", "four"); // Удаление других классов
      document.body.classList.add("two"); // Добавляем класс "two"
      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.classList.add("input-group");

      const userMessageName = document.createElement("p");
      userMessageName.classList.add("user-messege", "user-name");
      userMessageName.textContent = textareaValue;

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.name = "namecontact";
      nameInput.minLength = 2;
      nameInput.required = true;
      nameInput.style.display = "none";
      nameInput.value = textareaValue;

      inputGroupDiv.appendChild(userMessageName);
      inputGroupDiv.appendChild(nameInput);
      form.appendChild(inputGroupDiv);

      const inputGroupAnswerDiv = document.createElement("div");
      inputGroupAnswerDiv.classList.add("input-group-answer");
      const typewriter = document.createElement("p");
      typewriter.classList.add("typewriter");
      inputGroupAnswerDiv.appendChild(typewriter);
      form.appendChild(inputGroupAnswerDiv);

      const name = form.querySelector('input[name="namecontact"]').value;
      const secondStageMessage = getRandomSecondStageMessage(name);
      // const secondStageMessage = "Это этап 2";
      startTypewriterEffect(typewriter, secondStageMessage);
    }











// Этап 3: Ввод что нужно
    if (inputGroups.length === 2 && textareaValue !== "") {
      document.body.classList.remove("one", "two", "four"); // Удаление других классов
      document.body.classList.add("three"); // Добавляем класс "three"
      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.classList.add("input-group");

      const userMessage = document.createElement("p");
      userMessage.classList.add("user-messege");
      userMessage.textContent = textareaValue;

      const newTextarea = document.createElement("textarea");
      newTextarea.name = "textareacontact";
      newTextarea.rows = 3;
      newTextarea.required = true;
      newTextarea.style.display = "none";
      newTextarea.value = textareaValue;

      const input = document.createElement("input");
      input.id = "usercodecontact";
      input.type = "text";
      input.name = "usercodecontact";
      input.tabIndex = -1;
      input.value = "";
      input.autocomplete = "off";
      input.style.display = "none";

      inputGroupDiv.appendChild(userMessage);
      inputGroupDiv.appendChild(newTextarea);
      inputGroupDiv.appendChild(input);
      form.appendChild(inputGroupDiv);

      const inputGroupAnswerDiv = document.createElement("div");
      inputGroupAnswerDiv.classList.add("input-group-answer");
      const typewriter = document.createElement("p");
      typewriter.classList.add("typewriter");
      inputGroupAnswerDiv.appendChild(typewriter);
      form.appendChild(inputGroupAnswerDiv);

      const name = form.querySelector('input[name="namecontact"]').value;
      const thirdStageMessage = getRandomThirdStageMessage(name);

      startTypewriterEffect(typewriter, thirdStageMessage);
    }








    // Этап 4: Отправка формы
    if (inputGroups.length === 3 && textareaValue !== "") {
      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.classList.add("input-group");

      const userMessageContact = document.createElement("p");
      userMessageContact.classList.add("user-messege", "user-contact");
      userMessageContact.textContent = textareaValue;

      const contactInput = document.createElement("input");
      contactInput.type = "text";
      contactInput.name = "contactinfo";
      contactInput.required = true;
      contactInput.style.display = "none";
      contactInput.value = textareaValue;

      inputGroupDiv.appendChild(userMessageContact);
      inputGroupDiv.appendChild(contactInput);
      form.appendChild(inputGroupDiv);

      const inputGroupAnswerDiv = document.createElement("div");
      inputGroupAnswerDiv.classList.add("input-group-answer");
      const typewriter = document.createElement("p");
      typewriter.classList.add("typewriter");
      inputGroupAnswerDiv.appendChild(typewriter);
      form.appendChild(inputGroupAnswerDiv);

      const name = form.querySelector('input[name="namecontact"]').value;
      const contact = form.querySelector('input[name="contactinfo"]').value;

      const finalText = getRandomFourthStageMessage(name, contact);
      // const finalText = "Это этап 4";

      startTypewriterEffect(typewriter, finalText, 15, function () {
        const element = document.querySelector("form#tgcontact");
        addCountdownAndAutoSubmit(element);
      });
    }
  } else {
    // Если запрос не содержит ключевых слов или введён некорректно
    const unknownMessage = getRandomMessage("unknown");
    displayUserMessageAndResponse(textareaValue, unknownMessage);
  }










  document.getElementById("textarea").value = "";
  textarea.focus();
  updateBodyClass();
  updateSendButtonState();
});

// Изначально деактивируем кнопку отправки
updateSendButtonState();