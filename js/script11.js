
// const textElement = document.getElementById("typewriter");
// const cursorElement = document.querySelector(".cursor");
// const fullText = "Hi, I'm Mikhail! <br>How can I help you?";
// let index = 0;
// const speed = 25; // Скорость печати в миллисекундах

// // Скрываем изначальный текст для эффекта печати
// textElement.innerHTML = '';

// function typeWriter() {
//     if (index < fullText.length) {
//         // Проверяем наличие тега <br> и добавляем его как HTML
//         if (fullText.slice(index, index + 4) === "<br>") {
//             textElement.innerHTML += "<br>";
//             index += 4;
//         } else {
//             textElement.innerHTML += fullText.charAt(index);
//             index++;
//         }
//         setTimeout(typeWriter, speed);
//     } else {
//         // Убираем курсор через 1.4 секунды после завершения печати
//         setTimeout(() => {
//           cursorElement.style.animation = 'none'; // Останавливаем анимацию мигания
//           cursorElement.style.visibility = 'hidden'; // Скрываем курсор

//             // Добавляем класс 'run' тегу <body>
//             document.body.classList.add('run');
//         }, 1400);
//     }
// }

// // Добавляем задержку в 1.4 секунды перед началом печати
// window.onload = function() {
//     setTimeout(typeWriter, 1400);
// };







const textElement = document.getElementById("typewriter");
const cursorElement = document.querySelector(".cursor");
const fullText = "Hi, I'm Mikhail!\nHow can I help you?";
let index = 0;
const speed = 25; // Скорость печати в миллисекундах

// Скрываем изначальный текст для эффекта печати
textElement.innerHTML = '';

function typeWriter() {
    if (index < fullText.length) {
        // Проверяем наличие символа новой строки для задержки
        if (fullText.slice(index, index + 1) === "\n") {
            textElement.innerHTML += '<br>';
            index += 1;
            setTimeout(typeWriter, 1400); // Задержка в 3 секунды
        } else {
            textElement.innerHTML += fullText.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    } else {
        // Убираем курсор через 1.4 секунды после завершения печати
        setTimeout(() => {
            cursorElement.style.animation = 'none'; // Останавливаем анимацию мигания
            cursorElement.style.visibility = 'hidden'; // Скрываем курсор

            // Добавляем класс 'run' тегу <body>
            document.body.classList.add('run');
        }, 1400);
    }
}

// Добавляем задержку в 1.4 секунды перед началом печати
window.onload = function() {
    setTimeout(typeWriter, 700);
};








let activeSection = null;
let previousSections = []; // Массив для сохранения истории секций

// Общий обработчик событий для всех кнопок
document.addEventListener('click', function(event) {
    const clickedButton = event.target.closest('button');
    
    if (!clickedButton) return; // Если клик был не на кнопке, выходим

    // Проверяем, если кнопка имеет name="sendmessage", то игнорируем её
    if (clickedButton.getAttribute('name') === 'sendmessage') return;
    
    const sectionName = clickedButton.getAttribute('name');

    // Обработка нажатия кнопки "back"
    if (sectionName === 'back') {
        handleBackButton(clickedButton);
    } else {
        handleButtonClick(sectionName, clickedButton);
    }
});

// function handleButtonClick(targetSectionClass, clickedButton) {
//     const targetSection = document.querySelector(`section.${targetSectionClass}`);
//     const currentSection = clickedButton.closest('section');

//     if (currentSection) {
//         // Перемещаем текущую секцию за экран и меняем её прозрачность
//         currentSection.style.transform = 'translateX(-100vw)';
//         currentSection.style.opacity = '0';
//         previousSections.push(currentSection); // Сохраняем секцию в истории
//     }

//     // Перемещаем целевую секцию на экран и делаем её видимой
//     targetSection.style.transform = 'translateX(0vw)';
//     targetSection.style.opacity = '1';
//     activeSection = targetSection;
// }

// function handleBackButton(clickedButton) {
//     const currentSection = clickedButton.closest('section');

//     if (currentSection) {
//         // Перемещаем текущую активную секцию за экран и делаем её невидимой
//         currentSection.style.transform = 'translateX(100vw)';
//         currentSection.style.opacity = '0';
//     }

//     // Возвращаем предыдущую секцию на экран из истории
//     if (previousSections.length > 0) {
//         const lastSection = previousSections.pop();
//         lastSection.style.transform = 'translateX(0vw)';
//         lastSection.style.opacity = '1';
//         activeSection = lastSection;
//     }
// }

function handleButtonClick(targetSectionClass, clickedButton) {
    const targetSection = document.querySelector(`section.${targetSectionClass}`);
    const currentSection = clickedButton.closest('section');

    if (currentSection) {
        // Перемещаем текущую секцию за экран и меняем её прозрачность
        currentSection.style.left = '-100vw';
        currentSection.style.opacity = '0';
        currentSection.classList.remove('red'); // Удаляем класс red
        previousSections.push(currentSection); // Сохраняем секцию в истории
    }

    // Перемещаем целевую секцию на экран и делаем её видимой
    targetSection.style.left = '0vw';
    targetSection.style.opacity = '1';
    targetSection.classList.add('red'); // Добавляем класс red
    addQrImageAnimation(); // Добавляем анимацию для qr-image
    activeSection = targetSection;
}

function handleBackButton(clickedButton) {
    const currentSection = clickedButton.closest('section');

    if (currentSection) {
        // Перемещаем текущую активную секцию за экран и делаем её невидимой
        currentSection.style.left = '100vw';
        currentSection.style.opacity = '0';
        currentSection.classList.remove('red'); // Удаляем класс red
    }

    // Возвращаем предыдущую секцию на экран из истории
    if (previousSections.length > 0) {
        const lastSection = previousSections.pop();
        lastSection.style.left = '0vw';
        lastSection.style.opacity = '1';
        lastSection.classList.add('red'); // Добавляем класс red
        addQrImageAnimation(); // Добавляем анимацию для qr-image
        activeSection = lastSection;
    }
}





function addQrImageAnimation() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        section.red .qr-image #canvas:after {
            animation-name: t-logo-play;
            animation-delay: .15s;
        }
        section.red .qr-image.sendtg:after {
            animation-name: t-logo-play;
            animation-delay: .15s;
        }
        body.sendok section.anonymously-on-telegram .qr-image.sendtg:after {
            
            animation: 500ms steps(30) both;
            animation-name: t-logo-play-send;
            animation-delay: 0s;
        }
    `;
    document.head.appendChild(styleElement);
}









  function toggleVideo() {
      var container = document.querySelector('.video-viget-mikhail');
      var video = container.querySelector('video');

      if (video.muted) {
          video.muted = false;
          video.currentTime = 0;
          video.play();
          container.classList.add('start-video');

          // Установка таймера на 10 секунд для автоматического клика
          setTimeout(function() {
              if (container.classList.contains('start-video')) {
                  container.click();  // Автоматический клик по элементу
              }
          }, 19800); // 10000 миллисекунд = 10 секунд

      } else {
          video.muted = true;
          container.classList.remove('start-video');
      }
  }











        // Функция для обработки активации или ввода текста
        function handleInputActivation(element) {
            const nextLabel = element.nextElementSibling; // Получаем следующий элемент за input или textarea
            
            if (nextLabel && nextLabel.tagName.toLowerCase() === 'label') {
                if (element.value !== '') {
                    nextLabel.classList.add('active-label'); // Добавляем класс, если что-то введено
                } else {
                    nextLabel.classList.remove('active-label'); // Убираем класс, если поле пусто
                }
            }
        }

        // Обрабатываем событие focus и input для каждого поля input и textarea
        document.querySelectorAll('input, textarea').forEach(element => {
            element.addEventListener('focus', function() {
                handleInputActivation(this);
            });

            element.addEventListener('input', function() {
                handleInputActivation(this);
            });
        });













        const images = document.querySelectorAll('.qr-image .brand');
        let currentIndex = 0;
        
        function showImage(index) {
          images.forEach((img, i) => {
            if (i === index) {
              img.style.opacity = '1';
              img.style.transform = 'scale(1) translateX(0)';
              img.style.zIndex = '1'; // Поднимаем активное изображение наверх
            } else if (i < index) {
              img.style.opacity = '0';
              img.style.transform = 'scale(0.8) translateX(-100%)';
              img.style.zIndex = '0';
            } else {
              img.style.opacity = '0';
              img.style.transform = 'scale(0.8) translateX(100%)';
              img.style.zIndex = '0';
            }
          });
        }
        
        function cycleImages() {
          currentIndex = Math.floor(Math.random() * images.length);
          showImage(currentIndex);
        }
        
        // Initialize all images to be hidden except the first one
        images.forEach((img, i) => {
          img.style.opacity = i === 0 ? '1' : '0';
          img.style.transform = i === 0 ? 'scale(1) translateX(0)' : 'scale(0.8) translateX(100%)';
          img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          img.style.position = 'absolute';
        });
        
        // Start cycling through the images every 3 seconds
        setInterval(cycleImages, 3000);
