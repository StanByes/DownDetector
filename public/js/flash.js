document.addEventListener("DOMContentLoaded", () => {
    const flashMessage = document.getElementById("flash");
    if (flashMessage != null) {
        console.log(flashMessage.style.opacity);
        setTimeout(() => {
            let opacity = 1;
            let interval = setInterval(() => {
                opacity -= 0.1;
                flashMessage.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(interval);
                    flashMessage.remove();
                }
            }, 50);
        }, 1000 * 3);
    }
})