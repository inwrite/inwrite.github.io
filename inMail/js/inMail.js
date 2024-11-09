// Initialize interface if the element exists or when it appears dynamically
function createMailInterface() {
    const startDiv = document.querySelector('.inMail');
    if (!startDiv) {
        return;
    }

    startDiv.innerHTML = `
        <button id="loadMailBtn"><svg width="24" height="24"><use xlink:href="#icon-download"></use></svg><svg width="24" height="24"><use xlink:href="#icon-download"></use></svg><span>Load Emails from Server</span></button>
        <input id="addr" placeholder="your temporary email address" readonly>
        <button id="copyEmailBtn"><svg width="24" height="24"><use xlink:href="#icon-copy"></use></svg><svg width="24" height="24"><use xlink:href="#icon-success"></use></svg><span>Copy Email Address</span></button>
        <button id="newAddressBtn"><svg width="24" height="24"><use xlink:href="#icon-refresh"></use></svg><svg width="24" height="24"><use xlink:href="#icon-success"></use></svg><span>Generate New Address</span></button>
        <div id="emails"></div>
    `;

    document.getElementById("copyEmailBtn").onclick = () => {
        copyEmail();
    };
    document.getElementById("loadMailBtn").onclick = () => {
        refreshMail(true);
    };
    document.getElementById("newAddressBtn").onclick = () => {
        genEmail(); // Generate email on button click
    };

    // Generate initial email with a delay of 5 seconds
    setTimeout(() => {
        genEmail();
    }, 2000);
}

// Generate a new email
async function genEmail() {
    try {
        const response = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const [email] = await response.json();
        const addrElement = document.getElementById("addr");
        addrElement.value = email;
        refreshMail();

        // Add class 'ready' to .inMail
        const startDiv = document.querySelector('.inMail');
        if (startDiv) {
            startDiv.classList.add('ready');
        }

        updateButtonText("newAddressBtn", "New Address Generated", 2000);
    } catch (error) {
    }
}

// Copy email to clipboard
function copyEmail() {
    const email = document.getElementById("addr")?.value;
    if (!email) {
        alert("No email address to copy!");
        return;
    }

    navigator.clipboard.writeText(email)
        .then(() => {
            updateButtonText("copyEmailBtn", "Copied to Clipboard", 2000);
        })
        .catch(err => console.error("Failed to copy email:", err));
}

// Refresh the list of emails
async function refreshMail(isButtonClick = false) {
    const { user, domain } = getUserAndDomain() || {};
    if (!user || !domain) return;

    if (isButtonClick) {
        updateButtonText("loadMailBtn", "Checking for new emails...", 3000);
    }

    try {
        const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`);
        const emails = await response.json();
        const emailsElement = document.getElementById("emails");
        emailsElement.innerHTML = "";

        for (const email of emails) {
            emailsElement.innerHTML += createEmailRow(email);
            await loadEmail(email.id);
        }

        if (isButtonClick) {
            setTimeout(() => {
                const loadMailBtn = document.getElementById("loadMailBtn");

                // Remove previous classes .no-post and .new-post
                loadMailBtn.classList.remove("no-post", "new-post", "show-icon");

                if (emails.length === 0) {
                    updateButtonText("loadMailBtn", "No emails found! Try again.", null);
                    loadMailBtn.classList.add("no-post");
                    loadMailBtn.classList.remove("show-icon");
                } else {
                    updateButtonText("loadMailBtn", "All emails loaded", null);
                    loadMailBtn.classList.add("new-post");
                }
            }, 3000);
        }
    } catch (error) {
    }
}

// Update button text with support for SVG icons and class toggling
function updateButtonText(buttonId, text, delay) {
    const button = document.getElementById(buttonId);
    if (button) {
        // Remove all classes before updating text
        button.classList.remove("show-icon", "no-post", "new-post");

        const svgElements = button.querySelectorAll("svg");

        // Save the original button text if not already saved
        if (!button.hasAttribute("data-original-text")) {
            const originalSpan = button.querySelector("span");
            const originalText = originalSpan ? originalSpan.textContent : "";
            button.setAttribute("data-original-text", originalText);
        }

        button.innerHTML = ""; // Clear button content

        // Add all SVG elements back
        svgElements.forEach(svg => {
            button.appendChild(svg.cloneNode(true));
        });

        const span = document.createElement("span");
        span.textContent = text;
        button.appendChild(span);

        // Add class .show-icon
        button.classList.add("show-icon");

        // Restore original text after delay if applicable
        if (delay !== null && buttonId !== "loadMailBtn") {
            setTimeout(() => {
                button.innerHTML = "";
                svgElements.forEach(svg => {
                    button.appendChild(svg.cloneNode(true));
                });

                const originalText = document.createElement("span");
                originalText.textContent = button.getAttribute("data-original-text");

                button.appendChild(originalText);
                button.classList.remove("show-icon");
            }, delay);
        }
    }
}

// Get user and domain from email
function getUserAndDomain() {
    const addrElement = document.getElementById("addr");
    if (!addrElement) {
        return null;
    }

    const addrValue = addrElement.value;
    if (!addrValue) {
        alert("Please generate or input an email address first!");
        return null;
    }

    const [user, domain] = addrValue.split("@");
    if (!user || !domain) {
        return null;
    }
    return { user, domain };
}

// Load email content
async function loadEmail(id) {
    const { user, domain } = getUserAndDomain() || {};
    if (!user || !domain) return;

    try {
        const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${id}`);
        const email = await response.json();
        const elm = document.getElementById(id);
        if (elm) {
            elm.innerHTML = email.htmlBody || email.body;
        }

        if (email.attachments) {
            elm.appendChild(createAttachments(email.attachments, user, domain, id));
        }
    } catch (error) {
    }
}

// Create email row
function createEmailRow(email) {
    return `
        <div>
            <div><b>From:</b> ${email.from}</div>
            <div><b>Subject:</b> ${email.subject}</div>
            <div><b>Content:</b> <span id="${email.id}"></span></div>
        </div>
    `;
}

// Create attachment elements
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

// Initialize interface when element is ready
function initializeWhenReady() {
    if (document.querySelector('.inMail')) {
        createMailInterface();
    } else {
        // Set up a MutationObserver to watch for the addition of the .inMail element
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const inMailDiv = document.querySelector('.inMail');
                    if (inMailDiv) {
                        createMailInterface();
                        observer.disconnect(); // Stop observing once the element is found and initialized
                        break;
                    }
                }
            }
        });

        // Observe the entire document for changes in the child elements
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// Call the function to initialize the interface when ready
document.addEventListener("DOMContentLoaded", initializeWhenReady);

// Call function with delay for testing
updateButtonText("loadMailBtn", "Checking and loading emails from server", 3000);
