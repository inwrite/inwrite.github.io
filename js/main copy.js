document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("textarea");
  const buttonsContainer = document.querySelector(".qwestions-button");
  const buttons = Array.from(buttonsContainer.querySelectorAll(".qwestion"));
  const targetDiv = document.querySelector(".messege");
  let visibleButtons = [];
  let focusedIndex = -1;

  // Функция замены {callingcontact} и {name}
  function replacePlaceholders(text) {
    const callingcontact = document.querySelector('input[name="callingcontact"]')?.value || "";
    const name = document.querySelector('input[name="namecontact"]')?.value || "";
    return text.replace("{callingcontact}", callingcontact).replace("{name}", name);
  }

  // Обновление состояния кнопки отправки и класса у body
  function updateSendButtonState() {
    document.getElementById("qwestions-button-send").disabled = textarea.value.trim() === "";
  }

  function updateBodyClass() {
    document.body.classList.toggle("go", textarea.value.trim() !== "");
    updateSendButtonState();
  }

  // Автоматическая подгонка высоты textarea под содержимое
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    updateBodyClass();
  });

  // Обработчик для кнопки отправки
  document.getElementById("qwestions-button-send").addEventListener("click", () => {
    textarea.style.height = "auto";
  });

  // Обработчик для отображения кнопок на основе текста в textarea
  textarea.addEventListener("input", () => {
    const inputText = textarea.value.toLowerCase().trim();
    const inputWords = inputText.split(/\s+/);
    visibleButtons = [];

    if (inputText === "") {
      hideAllButtons();
      return;
    }

    if (inputWords.includes("/")) {
      showAllButtonsExcept("order");
      buttonsContainer.classList.add("slash-type");
    } else {
      buttonsContainer.classList.remove("slash-type");
      filterAndShowButtons(inputWords);
    }

    updateContainerHeight();
    addNextButtonHoverHandlers();
  });

  // Функция скрытия всех кнопок
  function hideAllButtons() {
    buttons.forEach((button) => (button.style.display = "none"));
    buttonsContainer.style.height = "0px";
    buttonsContainer.classList.remove("type");
  }

  function showAllButtonsExcept(excludeName) {
    buttons.forEach((button) => {
      button.style.display = button.getAttribute("name") !== excludeName ? "inline-block" : "none";
      if (button.style.display !== "none") visibleButtons.push(button);
    });
    buttonsContainer.classList.add("type");
  }

  // function filterAndShowButtons(inputWords) {
  //   buttons.forEach((button) => {
  //     const originalText = button.dataset.originalText;
  //     const buttonText = originalText.toLowerCase();
  //     const matchFound = inputWords.some((word) => buttonText.includes(word));

  //     if (matchFound) {
  //       button.style.display = "inline-block";
  //       visibleButtons.push(button);
  //       button.innerHTML = highlightText(originalText, inputWords);
  //     } else {
  //       button.style.display = "none";
  //       button.textContent = originalText;
  //       // button.innerHTML = `<span class="icon"><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg></span>${originalText}`;

  //     }
  //   });

  //   buttonsContainer.classList.toggle("type", visibleButtons.length > 0);
  // }




  function highlightText(text, words) {
    return words.reduce((highlighted, word) => {
      const regex = new RegExp(`(${escapeHTML(word)})`, "gi");
      return highlighted.replace(regex, '<span class="highlight-color">$1</span>');
    }, escapeHTML(text));
  }

  function updateContainerHeight() {
    const totalHeight = visibleButtons.reduce((height, button) => height + button.offsetHeight, 0);
    const additionalHeight = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    buttonsContainer.style.height = visibleButtons.length ? `${totalHeight + additionalHeight}px` : "0px";
  }

  function addNextButtonHoverHandlers() {
    buttons.forEach((button, index) => {
      button.addEventListener("mouseenter", () => highlightNextButton(index));
      button.addEventListener("focus", () => highlightNextButton(index));
      button.addEventListener("mouseleave", removeNextBtnClass);
      button.addEventListener("blur", removeNextBtnClass);
    });
  }

  function highlightNextButton(currentIndex) {
    removeNextBtnClass();
    for (let i = currentIndex + 1; i < buttons.length; i++) {
      if (buttons[i].style.display === "inline-block") {
        buttons[i].classList.add("nextbtn");
        break;
      }
    }
  }

  function removeNextBtnClass() {
    buttons.forEach((button) => button.classList.remove("nextbtn"));
  }

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Наблюдатель для изменения targetDiv и добавления класса к body
  const messageObserver = new MutationObserver(() => {
    document.body.classList.toggle("margin-top", targetDiv.innerHTML.trim() !== "");
  });
  messageObserver.observe(targetDiv, { childList: true, subtree: true, characterData: true });

  // Запуск наблюдателя изменений для контейнера сообщений
  function observeMessegeChanges() {
    const messegeContainer = document.querySelector(".messege");
    if (messegeContainer) {
      new MutationObserver(() => (buttonsContainer.style.height = "0px")).observe(messegeContainer, {
        childList: true,
        subtree: true
      });
    }
  }
  observeMessegeChanges();
});
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














document.addEventListener("click", function (event) {
  const button = event.target.closest(".qwestion");
  if (button) {
    const textarea = document.getElementById("textarea");
    const qwestionsData = button.getAttribute("data-qwestions") || "";
    textarea.value = qwestionsData;
    textarea.focus();

    // Пересчитываем высоту textarea после вставки текста
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    updateBodyClass();
    updateSendButtonState();
  }
});

// Обработчик для поля textarea, отслеживающий изменения
document.getElementById("textarea").addEventListener("input", () => {
  updateSendButtonState();
  updateBodyClass();
});

// Функция мигания курсора
function blinkCursor() {
  document.querySelectorAll(".cursor").forEach((cur) => {
    cur.style.visibility = cur.style.visibility === "visible" ? "hidden" : "visible";
  });
}
setInterval(blinkCursor, 350);
























// Функция запуска эффекта печати текста
function startTypewriterEffect(element, text, speed = 5, callback = () => {}) {
  let index = 0;
  element.innerHTML = '<span class="cursor">&#9679;</span>'; // Курсор добавлен сразу
  const textareaDiv = document.querySelector(".qwestions-textarea");
  const body = document.body;

  textareaDiv.classList.add("hide");
  body.classList.add("mess");

  let userScrolled = false;
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(currentScroll - lastScrollTop) > 50) userScrolled = true;
    lastScrollTop = currentScroll;
  });

  function scrollToBottom() {
    if (!userScrolled) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  function updateTextWithCursor() {
    const currentText = text.slice(0, index).replace(/\n/g, "<br/>");
    element.innerHTML = currentText + '<span class="cursor typing">&#9679;</span>';
  }

  function typeWriter() {
    if (index < text.length) {
      const remainingText = text.substring(index);
      const match = remainingText.match(/<(a|button|img)[^>]*>(.*?)<\/\1>|<img[^>]*>/);

      if (match && match.index === 0) {
        element.innerHTML += match[0];
        index += match[0].length;
        scrollToBottom();
        setTimeout(typeWriter, 0);
      } else {
        if (text[index] === "\n") {
          element.innerHTML += "<br/>";
          index++;
          scrollToBottom();
          setTimeout(typeWriter, 350);
        } else {
          index++;
          updateTextWithCursor();
          scrollToBottom();
          setTimeout(typeWriter, speed);
        }
      }
    } else {
      finalizeTypingEffect();
    }
  }

  function finalizeTypingEffect() {
    setTimeout(() => {
      element.innerHTML = text.replace(/\n/g, "<br/>");
      const textarea = document.getElementById("textarea");
      textarea?.focus();
      textareaDiv.classList.remove("hide");
      body.classList.remove("mess");
      scrollToBottom();
      callback();
    }, 350);
  }

  setTimeout(typeWriter, 350);
}
























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












const textarea = document.getElementById("textarea");

// Автоматическая подгонка высоты textarea под содержимое
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
});

// Обработчик для кнопки отправки сообщения с авто-сбросом высоты textarea
document.getElementById("qwestions-button-send").addEventListener("click", () => {
  textarea.style.height = "auto";
  // Логика отправки сообщения...
});

// Функция для удаления класса 'hide' с заданной задержкой
function removeHideClass(selector, delay) {
  setTimeout(() => document.querySelector(selector)?.classList.remove("hide"), delay);
}

// Убираем класс 'hide' у элементов через указанные задержки
removeHideClass(".qwestions.hide", 3350);
removeHideClass(".whoiam.hide", 3000);






















document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("textarea");
  const buttonsContainer = document.querySelector(".qwestions-button");
  const buttons = Array.from(buttonsContainer.querySelectorAll(".qwestion"));
  let visibleButtons = [];
  let focusedIndex = -1;

  // Инициализация кнопок
  buttons.forEach((button) => {
    button.style.display = "none";
    button.dataset.originalHTML = button.innerHTML; // Кэшируем весь HTML
  });

  textarea.addEventListener("input", () => {
    const inputText = textarea.value.toLowerCase().trim();
    const inputWords = inputText.split(/\s+/);
    visibleButtons = [];

    if (inputText === "") {
      hideAllButtons();
      return;
    }

    if (inputWords.includes("/")) {
      showAllButtonsExcept("order");
      buttonsContainer.classList.add("slash-type");
    } else {
      buttonsContainer.classList.remove("slash-type");
      filterAndShowButtons(inputWords);
    }

    updateContainerHeight();
    addNextButtonHoverHandlers();
  });

  function hideAllButtons() {
    buttons.forEach((button) => (button.style.display = "none"));
    buttonsContainer.style.height = "0px";
    buttonsContainer.classList.remove("type");
  }

  function showAllButtonsExcept(excludeName) {
    buttons.forEach((button) => {
      button.style.display = button.getAttribute("name") !== excludeName ? "flex" : "none";
      if (button.style.display !== "none") visibleButtons.push(button);
    });
    buttonsContainer.classList.add("type");
  }

  function filterAndShowButtons(inputWords) {
    let firstVisibleButton = null;
    let anyButtonVisible = false;

    buttons.forEach((button) => {
      const originalHTML = button.dataset.originalHTML;
      const textSpan = document.createElement("div");
      textSpan.innerHTML = originalHTML;
      // const spanText = textSpan.querySelector(".button-text").textContent.toLowerCase();
      const spanElement = textSpan.querySelector(".button-text");
const spanText = spanElement ? spanElement.textContent.toLowerCase() : "";

      const matchFound = inputWords.some((word) => spanText.includes(word));

      if (matchFound) {
        button.style.display = "flex";
        visibleButtons.push(button);
        anyButtonVisible = true;

        button.innerHTML = highlightText(originalHTML, inputWords);
        if (!firstVisibleButton) firstVisibleButton = button;
      } else {
        button.style.display = "none";
        button.innerHTML = originalHTML; // Восстанавливаем оригинальный HTML
      }
    });

    if (firstVisibleButton) firstVisibleButton.classList.add("highlight");
    buttonsContainer.classList.toggle("type", anyButtonVisible);
  }

  function highlightText(html, words) {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const spanText = tempDiv.querySelector(".button-text");
    const originalText = spanText.textContent;

    spanText.innerHTML = words.reduce((highlighted, word) => {
      if (word) {
        const regex = new RegExp(`(${escapeHTML(word)})`, "gi");
        return highlighted.replace(regex, '<span class="highlight-color">$1</span>');
      }
      return highlighted;
    }, escapeHTML(originalText));

    return tempDiv.innerHTML;
  }

  function updateContainerHeight() {
    const totalHeight = visibleButtons.reduce((height, button) => height + button.offsetHeight, 0);
    const additionalHeight = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    buttonsContainer.style.height = visibleButtons.length ? `${totalHeight + additionalHeight}px` : "0px";
  }

  function observeMessegeChanges() {
    const messegeContainer = document.querySelector(".messege");
    if (messegeContainer) {
      new MutationObserver(() => (buttonsContainer.style.height = "0px")).observe(messegeContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  document.addEventListener("keydown", (event) => {
    if (visibleButtons.length > 0) {
      if (event.key === "ArrowDown") {
        focusedIndex = (focusedIndex + 1) % visibleButtons.length;
        visibleButtons[focusedIndex].focus();
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        focusedIndex = focusedIndex === 0 ? -1 : (focusedIndex - 1 + visibleButtons.length) % visibleButtons.length;
        (focusedIndex === -1 ? textarea : visibleButtons[focusedIndex]).focus();
        event.preventDefault();
      }
    }
  });

  function addNextButtonHoverHandlers() {
    buttons.forEach((button, index) => {
      button.addEventListener("mouseenter", () => highlightNextButton(index));
      button.addEventListener("focus", () => highlightNextButton(index));
      button.addEventListener("mouseleave", removeNextBtnClass);
      button.addEventListener("blur", removeNextBtnClass);
    });
  }

  function highlightNextButton(currentIndex) {
    removeNextBtnClass();
    for (let i = currentIndex + 1; i < buttons.length; i++) {
      if (buttons[i].style.display === "flex") {
        buttons[i].classList.add("nextbtn");
        break;
      }
    }
  }

  function removeNextBtnClass() {
    buttons.forEach((button) => button.classList.remove("nextbtn"));
  }

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  observeMessegeChanges();
});


























const targetDiv = document.querySelector(".messege");

// Функция для добавления или удаления класса у body
function toggleBodyClass() {
  document.body.classList.toggle("margin-top", targetDiv.innerHTML.trim() !== "");
}

// Создаём MutationObserver для отслеживания изменений в targetDiv
const messageObserver = new MutationObserver(toggleBodyClass);

// Настраиваем наблюдатель для отслеживания изменений в targetDiv
messageObserver.observe(targetDiv, { childList: true, subtree: true, characterData: true });














































// Массивы с вариантами сообщений
const messages = {
  contact: [
    // "<strong>Contact me directly via Telegram Messenger</strong> for a prompt response...\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a>\nIf Telegram is not available, use the form below.",
    // другие сообщения...
    "Это рандомное изображение\n\n<img class='randomsvg' src='' alt='Random SVG'></img>"
  ],
  ukrain: [
    "I firmly stand with Ukraine and strongly condemn the actions of the current Russian government. I cannot remain indifferent to what is happening and consider the aggression and interference aimed at suppressing the sovereignty and freedom of another country unacceptable. The Ukrainian people have the right to independence, peace, and security. I stand in solidarity with those striving for freedom and support any steps toward ending the conflict and establishing justice.\n\n <img class='fuck' alt='stop_putin_stop_war' src='ukr/stop_putin_stop_war.svg'>\n\nBy following the <a href='https://www.instagram.com/p/C9KAuhJo4VF/?hl=en&img_index=8' target='_blank'>link on Instagram,</a> you can witness one of the many acts of violence carried out by the Russian government in Ukraine. In the past, Russian forces have targeted key medical facilities, including children’s hospitals and specialized centers, destroying places meant to save lives. These actions reflect a brutal aggression and complete disregard for the safety of civilians."
  ],
  tempmail: ["<div class='temp-mail'></div>"],
  personal: [
    "<strong>I am a web developer specializing in supporting small and medium-sized businesses in achieving success online.</strong> My mission is to help companies increase their visibility on the web and strengthen customer relationships through effective and reliable web solutions.\n\nIn addition to client work, I am the founder and visionary behind several personal projects:\n<ul><li><a href='https://inwrite.org/' target='_blank'>inWrite</a> — a convenient platform for anonymous online publishing, allowing you to share thoughts and ideas without registration.</li><li><a href='https://inwrite.org/chat/' target='_blank'>inChat</a> — a secure anonymous messenger for online communication and message exchange.</li><li><a href='https://inwrite.github.io/inmail/' target='_blank'>inMail</a> — a service providing temporary email addresses for anonymous and secure receipt of emails.</li><li><a href='https://wopr.ru/' target='_blank'>WoPr</a> — a platform offering free creation and hosting of websites of any complexity on the WordPress CMS.</li><li><a href='https://usink.ru/' target='_blank'>UsInk</a> — a service for creating and hosting simple business card websites, suitable for personal and professional purposes.</li><li><a href='https://inwrite.github.io/protest/' target='_blank'>Protest</a> — a collection of my artwork and covers in SVG format, available under the Creative Commons Zero (CC0) license.</li></ul>For those interested in my early projects, <a href='https://inwrite.github.io/xiv/' target='_blank'>my old portfolio</a> is also available for review.\n\nI am always open to new challenges and strive to find innovative solutions that help businesses grow and adapt to modern demands.",

    "<strong>I am a web developer helping small and medium-sized businesses achieve success online.</strong> My main goal is to enhance brand visibility and build strong relationships with customers through high-quality and modern web products.\n\nI am also the founder and visionary behind several exciting projects:\n<ul><li><a href='https://inwrite.org/' target='_blank'>inWrite</a> — an online platform for anonymous publishing, providing a way to share content without mandatory registration.</li><li><a href='https://inwrite.org/chat/' target='_blank'>inChat</a> — a secure space for anonymous communication and message exchange online.</li><li><a href='https://inwrite.github.io/inmail/' target='_blank'>inMail</a> — a service for creating temporary email addresses, ensuring protection and privacy.</li><li><a href='https://wopr.ru/' target='_blank'>WoPr</a> — a system for free website creation and management using WordPress CMS.</li><li><a href='https://usink.ru/' target='_blank'>UsInk</a> — a fast platform for creating simple and convenient business card websites.</li><li><a href='https://inwrite.github.io/protest/' target='_blank'>Protest</a> — a unique collection of SVG artwork available for free use under the Creative Commons Zero (CC0) license.</li></ul>To explore my early projects, you can check out <a href='https://inwrite.github.io/xiv/' target='_blank'>my old portfolio</a>, which I no longer maintain.\n\nI am always eager for new projects and strive to find unique solutions that drive business growth and development.",

    "<strong>I am a web developer who helps small and medium-sized businesses thrive in the digital space.</strong> My goal is to increase companies' online presence and improve customer engagement through innovative web solutions.\n\nIn addition to client projects, I develop and support my own initiatives:\n<ul><li><a href='https://inwrite.org/' target='_blank'>inWrite</a> — a service for anonymous publishing, making it easy to share thoughts online without registration.</li><li><a href='https://inwrite.org/chat/' target='_blank'>inChat</a> — a secure platform for anonymous communication and information exchange.</li><li><a href='https://inwrite.github.io/inmail/' target='_blank'>inMail</a> — a service for temporary email addresses, allowing for the secure receipt of emails.</li><li><a href='https://wopr.ru/' target='_blank'>WoPr</a> — a platform for free website creation and hosting using the WordPress CMS.</li><li><a href='https://usink.ru/' target='_blank'>UsInk</a> — a service for quickly creating business card websites, ideal for both business and personal needs.</li><li><a href='https://inwrite.github.io/protest/' target='_blank'>Protest</a> — a collection of unique SVG artwork available under the Creative Commons Zero (CC0) license.</li></ul>My <a href='https://inwrite.github.io/xiv/' target='_blank'>old portfolio</a> is available for those who want to learn more about my early projects.\n\nI am always looking for new opportunities to create web solutions that help businesses adapt and flourish in a rapidly changing market.",

    "<strong>As a web developer, I help small and medium-sized businesses succeed online.</strong> My goal is to make companies stand out from the competition and build long-lasting customer relationships through modern web tools.\n\nI am also the creator and leader of several personal projects:\n<ul><li><a href='https://inwrite.org/' target='_blank'>inWrite</a> — an online platform for simple anonymous publishing, allowing you to share content without registration.</li><li><a href='https://inwrite.org/chat/' target='_blank'>inChat</a> — a secure messenger for anonymous communication online.</li><li><a href='https://inwrite.github.io/inmail/' target='_blank'>inMail</a> — a service for temporary email addresses, enabling anonymous and secure receipt of emails.</li><li><a href='https://wopr.ru/' target='_blank'>WoPr</a> — a platform that allows free creation and hosting of websites using WordPress CMS.</li><li><a href='https://usink.ru/' target='_blank'>UsInk</a> — a convenient tool for creating simple business card websites, suitable for various purposes.</li><li><a href='https://inwrite.github.io/protest/' target='_blank'>Protest</a> — a collection of SVG artwork available for free use under the Creative Commons Zero (CC0) license.</li></ul>If you are interested in my early work, feel free to check out <a href='https://inwrite.github.io/xiv/' target='_blank'>my old portfolio</a>, which, although no longer updated, can still be of interest.\n\nI am constantly striving to create solutions that help businesses adapt to new conditions and achieve their goals in the digital space.",
  ],
  unknown: [
    "Request not recognized. Please clarify or use the suggested options.",
    "Sorry, I didn't understand your request. Please clarify or choose one of the suggested options.",
    "Unable to recognize the request. Please rephrase it or use the hints provided.",
    "Unfortunately, the request is unclear. Please clarify or select one of the suggested options.",
    "Request not recognized. Please rephrase or use the suggested wording.",
    "Couldn't understand the request. Please try phrasing it differently or use the options provided.",
    "Sorry, your request wasn't understood. Try stating it another way or selecting one of the options.",
    "Unfortunately, I couldn't understand your request. Please rephrase it or choose a hint."
],

firstStage: {
    DefaultMessagevalidKeywords: [
        "You want to contact me? Great!\n\n<strong>Please start by telling me your name.</strong>\n<blockquote><em class='black50'>For example</em>: John Doe</blockquote>",
        "Glad you want to get in touch!\n\n<strong>Please share your name.</strong>\n<blockquote><em class='black50'>For example</em>: John Doe</blockquote>",
        "Want to reach out? Wonderful!\n\n<strong>First, let me know how to address you.</strong>\n<blockquote><em class='black50'>For example</em>: John Doe</blockquote>",
        "Fantastic that you want to connect!\n\n<strong>Could you please tell me your name?</strong>\n<blockquote><em class='black50'>For example</em>: John Doe</blockquote>",
    ]
},

secondStage: [
    "<strong>Nice to meet you, {name}! Tell me how I can assist...</strong>\n<blockquote><em class='black50'>For example</em>:\n“Hello, Michael! We need to improve our site’s performance and make it mobile-friendly. Looking forward to your support!”</blockquote>",
    "<strong>Pleasure to meet you, {name}! Describe what you need...</strong>\n<blockquote><em class='black50'>For example</em>:\n“Good day, Michael! We're working on a new project and need some guidance in development. We’d appreciate your expert opinion!”</blockquote>",
    "<strong>Nice to meet you, {name}! Let me know how I can help...</strong>\n<blockquote><em class='black50'>For example</em>:\n“Hi, Michael! We have a site but want to modernize it and add new features for users. Hoping for your assistance!”</blockquote>",
    "<strong>Glad to meet you, {name}! Tell me what’s needed for a successful outcome...</strong>\n<blockquote><em class='black50'>For example</em>:\n“Hello, Michael! We need to update the website structure and improve its visual design. Counting on your help for this.”</blockquote>",
],

thirdStage: [
    "<strong>Got it, {name}! Where should I send my reply?</strong>\n<blockquote><em class='black50'>For example</em>:\n <ul><li>Email — <strong>example@domain.com</strong></li><li>Telegram — <strong>@example</strong><span class='black50'>(your Telegram username)</span></li><li>WhatsApp — <strong>+0 (000) 000-0000</strong><span class='black50'>(your WhatsApp number)</span></li></ul></blockquote>",
    "<strong>All set, {name}! Let me know where you’d like to receive a reply.</strong>\n<blockquote><em class='black50'>For example</em>:\n <ul><li>Email — <strong>example@domain.com</strong></li><li>Telegram — <strong>@example</strong><span class='black50'>(your Telegram username)</span></li><li>WhatsApp — <strong>+0 (000) 000-0000</strong><span class='black50'>(your WhatsApp number)</span></li></ul></blockquote>",
    "<strong>Thank you, {name}! Please specify the best contact method for my reply.</strong>\n<blockquote><em class='black50'>For example</em>:\n <ul><li>Email — <strong>example@domain.com</strong></li><li>Telegram — <strong>@example</strong><span class='black50'>(your Telegram username)</span></li><li>WhatsApp — <strong>+0 (000) 000-0000</strong><span class='black50'>(your WhatsApp number)</span></li></ul></blockquote>",
    "<strong>Great, {name}! Where would you prefer to receive the reply?</strong>\n<blockquote><em class='black50'>For example</em>:\n <ul><li>Email — <strong>example@domain.com</strong></li><li>Telegram — <strong>@example</strong><span class='black50'>(your Telegram username)</span></li><li>WhatsApp — <strong>+0 (000) 000-0000</strong><span class='black50'>(your WhatsApp number)</span></li></ul></blockquote>"
],

fourthStage: [
    "<strong>Thank you, {name}!</strong>\nI've received all the necessary information to begin. Preparing the message for sending...",
    "<strong>Thanks, {name}!</strong>\nAll set, and I'm ready to start our conversation. Preparing to send your first message...",
    "<strong>Thank you, {name}!</strong>\nEverything is in place for us to start. Finalizing your message for sending...",
    "<strong>Much appreciated, {name}!</strong>\nI now have all the info needed to begin. Getting your message ready to go..."
],

  sendSuccess: [
    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-success-fill'></use></svg></div><div class='flex-text'>Message successfully sent, <strong>{name}!</strong>\nI will get in touch with you shortly via <strong>{contact}</strong>.<button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",
    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-success-fill'></use></svg></div><div class='flex-text'>Your message has been received, <strong>{name}!</strong>\nExpect my response through <strong>{contact}</strong> soon.<button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",
    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-success-fill'></use></svg></div><div class='flex-text'>All necessary information has been accepted, <strong>{name}!</strong>\nI will contact you soon using <strong>{contact}</strong>.<button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",
    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-success-fill'></use></svg></div><div class='flex-text'>Your request has been successfully processed, <strong>{name}!</strong>\nI will reach out to you shortly via <strong>{contact}</strong>.<button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",
  ],
  sendError: [
    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-warning-fill'></use></svg></div><div class='flex-text'>Unfortunately, <strong>{name}</strong>, there was an error sending your message.\nIt seems that the service is temporarily overloaded and unable to process your request.\n\nPlease try again later or contact me via Telegram Messenger.\n\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a><button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",

    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-warning-fill'></use></svg></div><div class='flex-text'>Apologies, <strong>{name}</strong>, but the message couldn't be sent.\nThe service is currently unavailable due to high traffic.\n\nPlease try sending the message later or reach out to me through Telegram Messenger for quick assistance.</div></div>\n\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a><button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",

    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-warning-fill'></use></svg></div><div class='flex-text'>Sorry for the inconvenience, <strong>{name}</strong>.\nThere was an error sending your message due to service overload.\n\nPlease try again later or use Telegram Messenger to get in touch.</div></div>\n\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a><button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",

    "<div class='flex'><div class='flex-icon'><svg width='24' height='24'><use xlink:href='#icon-warning-fill'></use></svg></div><div class='flex-text'>Regrettably, <strong>{name}</strong>, your message couldn't be sent.\nThe service is currently overloaded and cannot process your request.\n\nPlease try again later or use Telegram Messenger for a faster response.</div></div>\n\n<a class='qr' href='https://t.me/incwrite' target='_blank'><span></span></a><button onclick='clearAllMessages()'><svg width='24' height='24'><use xlink:href='#icon-delete'></use></svg>Clear chat history</button></div></div>",
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
    // "contact",
    // "get in touch",
    // "connection",
    // "contacts",
    // "contact information",
    // "how to find",
    // "contact details",
    // "available contacts",
    // "ways to contact",
    // "where to find",
    // "how to get in touch",
    // "contact number",
    // "contact email",
    // "how to write",
    // "how to call",
    // "how to ask a question",
    // "how to send a message",
    // "how to write to you",
    // "want to contact",
    // "how can I reach you",
    // "find you",
    // "random",
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

  const tempmailKeywords = [
  "temp",
  "temporary",
  "temp mail",
  ];

  const clearKeywords = [
  "clear",
  "clear chat",
  "clear history",
  "clnew conversation",
  "remove",
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