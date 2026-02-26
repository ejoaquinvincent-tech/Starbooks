
function doLogin(e) {
    e.preventDefault();

    console.log("we boutta log in!");

    const emailField = document.getElementById("login-email").value;

    // gets the index of '@' then
    // split the string from the
    // beginning until index of '@'
    const name = emailField.substring(0, emailField.indexOf('@'));

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("accountName", name);

    window.location.href = "main.html";
}

function doLogout() {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("accountName", "");

    window.location.reload();
}

function updateView() {
    const loginForm = document.getElementById('login-form');
    const alreadyLoggedIn = document.getElementById('already-logged-in');
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        alreadyLoggedIn.getElementsByTagName("h2")[0].innerHTML += ` ${localStorage.getItem('accountName')}`;
        loginForm.style.display = 'none';  // hide login form
    } else {
        alreadyLoggedIn.style.display = 'none';  // hide "already logged in" card
    }
}

updateView();
