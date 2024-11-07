document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("textarea");
    const buttonsContainer = document.querySelector(".qwestions-button");
    const buttons = Array.from(buttonsContainer.querySelectorAll(".qwestion"));
    let visibleButtons = [];
    let focusedIndex = -1;
  
    // Инициализация кнопок
    buttons.forEach((button) => {
      button.style.display = "none";
      button.dataset.originalText = button.textContent;
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
        button.style.display = button.getAttribute("name") !== excludeName ? "inline-block" : "none";
        if (button.style.display !== "none") visibleButtons.push(button);
      });
      buttonsContainer.classList.add("type");
    }
  
    function filterAndShowButtons(inputWords) {
      let firstVisibleButton = null;
      let anyButtonVisible = false;
  
      buttons.forEach((button) => {
        const originalText = button.dataset.originalText;
        const buttonText = originalText.toLowerCase();
        const matchFound = inputWords.some((word) => buttonText.includes(word));
  
        if (matchFound) {
          button.style.display = "inline-block";
          visibleButtons.push(button);
          anyButtonVisible = true;
  
          button.innerHTML = highlightText(originalText, inputWords);
          if (!firstVisibleButton) firstVisibleButton = button;
        } else {
          button.style.display = "none";
          button.textContent = originalText;
        }
      });
  
      if (firstVisibleButton) firstVisibleButton.classList.add("highlight");
      buttonsContainer.classList.toggle("type", anyButtonVisible);
    }
  
    function highlightText(text, words) {
      return words.reduce((highlighted, word) => {
        if (word) {
          const regex = new RegExp(`(${escapeHTML(word)})`, "gi");
          return highlighted.replace(regex, '<span class="highlight-color">$1</span>');
        }
        return highlighted;
      }, escapeHTML(text));
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
  
    observeMessegeChanges();
  });
  