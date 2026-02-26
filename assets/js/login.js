function login(e) {
    e.preventDefault();

    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "main.html";
}