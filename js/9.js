const targetDiv = document.querySelector(".messege");

// Функция для добавления или удаления класса у body
function toggleBodyClass() {
  document.body.classList.toggle("margin-top", targetDiv.innerHTML.trim() !== "");
}

// Создаём MutationObserver для отслеживания изменений в targetDiv
const messageObserver = new MutationObserver(toggleBodyClass);

// Настраиваем наблюдатель для отслеживания изменений в targetDiv
messageObserver.observe(targetDiv, { childList: true, subtree: true, characterData: true });
