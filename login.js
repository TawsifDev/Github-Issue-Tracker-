const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        errorMsg.classList.add("hidden");
        window.location.href = "main.html";  
    } else {
        errorMsg.classList.remove("hidden");
    }
});