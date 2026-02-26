const isLoggedIn = localStorage.getItem("isLoggedIn");

if ( isLoggedIn === "true" ) {
    const loginButton = document.getElementById('sign-in-button'); // the id always available because navbar IS always present in each page

    loginButton.innerHTML = "Signed";
    loginButton.classList.replace('outlined-button', 'primary-button');
}

// document.documentElement.setAttribute('ui-theme', 'dark');
