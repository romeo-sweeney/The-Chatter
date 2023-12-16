document.addEventListener("DOMContentLoaded", () => {
    // bypass
    const bypass = document.getElementById("bypass");
    if (bypass) {
        bypass.addEventListener("click", () => {
            window.location.href = "/bypass";
        });
    }
    
    const loginButtonElement = document.getElementById("loginButton");
    const signUpButtonElement = document.getElementById("signUpButton");
    const logoutButtonElement = document.getElementById("logoutButton");

    if (loginButtonElement) {
        loginButtonElement.addEventListener("click", () => {
            window.location.href = "/login";
        });
    }

    if (signUpButtonElement) {
        signUpButtonElement.addEventListener("click", () => {
            window.location.href = "/signup";
        });
    }

    if (logoutButtonElement) {
        logoutButtonElement.addEventListener("click", () => {
            window.location.href = "/logout";
        });
    }
});
