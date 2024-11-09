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
