const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn === "true") {
    const loginButton = document.getElementById('sign-in-button'); // the id always available because navbar IS always present in each page

    loginButton.innerHTML = "Account";
    loginButton.classList.replace('positive-button', 'outlined-button');
}

// document.documentElement.setAttribute('ui-theme', 'dark');
