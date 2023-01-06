// Made with
console.info(
  '</> with %c♥️%c from Mikhail',
  'color: #e25555', 'color: unset'
);

// toggleTheme(dark)
function toggleTheme(dark) {
  document.documentElement.classList.toggle('theme_dark', dark);
  window.Telegram && Telegram.setWidgetOptions({dark: dark});
}
if (window.matchMedia) {
  var darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
  toggleTheme(darkMedia.matches);
  darkMedia.addListener(function(e) {
    toggleTheme(e.matches);
  });
}
