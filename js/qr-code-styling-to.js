const qrCode = new QRCodeStyling({
    width: 240,
    height: 240,
    type: "svg",
    data: "https://t.me/incwrite",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    // image: "t_logo_sprite.svg",
    
    dotsOptions: {
        color: "#000000",
        type: "rounded"
    },

    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000"
    },
    backgroundOptions: {
        color: "",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 13.5
    }
});
qrCode.append(document.getElementById("canvas"));