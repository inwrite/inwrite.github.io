document.body.addEventListener('click', e => {
    if (e.target?.id === 'loadImageButton') {
        console.log('Кнопка нажата');

        const img = document.querySelector('.randomsvg');
        if (!img) {
            console.error('Элемент .randomsvg не найден!');
            return;
        }

        const files = [
            'bird.svg', 'bird2.svg', 'puck_futin.svg', 'bliat.svg', 
            'fctptn.svg', 'navalny.svg', 'RU_Z_UA_Ctrl-Z.svg', 
            'stop_putin_stop_war.svg', 'stop_putin.svg', 'zasilie.svg'
        ];

        const randomSvg = files[Math.floor(Math.random() * files.length)];
        const newSrc = `index-file/ukr/${randomSvg}?nocache=${Date.now()}`;

        console.log(`Выбранный файл: ${randomSvg}`);
        console.log(`Обновленный src: ${newSrc}`);

        img.src = newSrc;
        img.onerror = () => console.error(`Ошибка загрузки изображения: ${newSrc}`);
    }
});
