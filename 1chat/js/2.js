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
