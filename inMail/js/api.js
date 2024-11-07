// Инициализация интерфейса
function createMailInterface() {
    const startDiv = document.querySelector('.inMail');
    if (!startDiv) {
        console.error("Ошибка: Элемент с классом 'start' не найден.");
        return;
    }

    startDiv.innerHTML = `
        <input id="addr" placeholder="email address" readonly>
        <button id="copyEmailBtn"><svg width="24" height="24"><use xlink:href="#icon-copy"></use></svg>Copy Email</button>
        <button id="loadMailBtn"><svg width="24" height="24"><use xlink:href="#icon-download"></use></svg>Load Mail</button>
        <button id="newAddressBtn"><svg width="24" height="24"><use xlink:href="#icon-refresh"></use></svg>New Address</button>
        <div id="emails"></div>
    `;

    document.getElementById("copyEmailBtn").onclick = copyEmail;
    document.getElementById("loadMailBtn").onclick = () => refreshMail(true);
    document.getElementById("newAddressBtn").onclick = genEmail;

    // Генерация начального email
    genEmail();
}

// Генерация нового email
// Генерация нового email
async function genEmail() {
    try {
        const response = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const [email] = await response.json();
        const addrElement = document.getElementById("addr");
        addrElement.value = email;
        refreshMail();

        updateButtonText("newAddressBtn", "New address received", 3000);
    } catch (error) {
        console.error("Failed to generate email:", error);
    }
}

// Копирование email в буфер обмена
function copyEmail() {
    const email = document.getElementById("addr")?.value;
    if (!email) {
        alert("No email address to copy!");
        return;
    }

    navigator.clipboard.writeText(email)
        .then(() => updateButtonText("copyEmailBtn", "Email copied", 3000))
        .catch(err => console.error("Failed to copy email:", err));
}

// Обновление списка писем
async function refreshMail(isButtonClick = false) {
    const { user, domain } = getUserAndDomain() || {};
    if (!user || !domain) return;

    if (isButtonClick) updateButtonText("loadMailBtn", "Loading new letters", 2000);

    try {
        const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`);
        const emails = await response.json();
        const emailsElement = document.getElementById("emails");
        emailsElement.innerHTML = emails.length ? "" : "";

        for (const email of emails) {
            emailsElement.innerHTML += createEmailRow(email);
            await loadEmail(email.id);
        }

        if (isButtonClick) {
            const message = emails.length ? "New letters received" : "There are no new letters";
            updateButtonText("loadMailBtn", message, 3000);
        }
    } catch (error) {
        console.error("Failed to refresh mail:", error);
    }
}

// Получение данных пользователя и домена
function getUserAndDomain() {
    const addrElement = document.getElementById("addr");
    if (!addrElement) {
        console.error("Ошибка: Элемент с id 'addr' не найден.");
        return null;
    }
    
    const addrValue = addrElement.value;
    if (!addrValue) {
        alert("Please generate or input an email address first!");
        return null;
    }

    const [user, domain] = addrValue.split("@");
    if (!user || !domain) {
        console.error("Ошибка: Неверный формат email-адреса.");
        return null;
    }
    return { user, domain };
}

// Загрузка содержимого письма
// Загрузка содержимого письма
async function loadEmail(id) {
    const { user, domain } = getUserAndDomain() || {};
    if (!user || !domain) return;

    try {
        const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${id}`);
        const email = await response.json();
        const elm = document.getElementById(id);
        if (elm) elm.innerHTML = email.htmlBody || email.body;
        
        // Добавление вложений
        if (email.attachments) elm.appendChild(createAttachments(email.attachments, user, domain, id));
    } catch (error) {
        console.error("Failed to load email:", error);
    }
}

// Создание строки письма
function createEmailRow(email) {
    return `
        <div>
            <div><b>From:</b> ${email.from}</div>
            <div><b>Subject:</b> ${email.subject}</div>
            <div><b>Content:</b> <span id="${email.id}"></span></div>
        </div>
    `;
}

// Создание элементов вложений
function createAttachments(attachments, user, domain, id) {
    const attsDiv = document.createElement("div");
    attachments.forEach(file => {
        const link = document.createElement("a");
        link.href = `https://www.1secmail.com/api/v1/?action=download&login=${user}&domain=${domain}&id=${id}&file=${file.filename}`;
        link.textContent = file.filename;
        attsDiv.appendChild(link);
    });
    return attsDiv;
}


// Обновление текста кнопки с поддержкой SVG
function updateButtonText(buttonId, text, delay) {
    const button = document.getElementById(buttonId);
    if (button) {
        const originalContent = button.innerHTML; // Сохраняем исходный HTML, включая SVG

        // Если кнопка содержит SVG, изменяем текст без нарушения структуры SVG
        const svgElement = button.querySelector("svg");
        if (svgElement) {
            const span = document.createElement("span");
            span.textContent = text;
            button.innerHTML = ""; // Очищаем кнопку

            button.appendChild(svgElement.cloneNode(true)); // Добавляем SVG обратно
            button.appendChild(span); // Добавляем текст
        } else {
            button.textContent = text; // Обновляем текст для кнопок без SVG
        }

        // Восстанавливаем исходное содержимое кнопки через указанный промежуток времени
        setTimeout(() => (button.innerHTML = originalContent), delay);
    }
}



// Инициализация интерфейса при загрузке страницы
document.addEventListener("DOMContentLoaded", createMailInterface);
