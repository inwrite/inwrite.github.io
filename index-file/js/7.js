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
