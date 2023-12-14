// credits to https://stackoverflow.com/questions/65735249/how-to-make-a-css-generated-white-heart-change-its-colour-on-clicking
document.addEventListener("DOMContentLoaded", () => {
    const heart = document.querySelector(".heart");
    if (heart) {
        heart.onclick = () => heart.classList.toggle("heartClicked");
    }
});