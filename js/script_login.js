//-------------------- general ---------------------//
var first_time = 1;
var first_time_hamburger_icon = 1;
function show_hamburger_content() {
    var hamburger_content = document.getElementById("hamburger_content");
    var hamburger_content_shadow = document.getElementById("hamburger_content_shadow");
    var displaying = hamburger_content.style.display === "none";
    if (displaying) {
        hamburger_content.style.display = "block";
        hamburger_content_shadow.style.display = "block";
    } else {
        hamburger_content.style.display = "none";
        hamburger_content_shadow.style.display = "none";
    }

    if (first_time_hamburger_icon) {
        hamburger_content.style.display = "block";
        hamburger_content_shadow.style.display = "block";
        first_time_hamburger_icon = !first_time_hamburger_icon;
    }
}

function check_login() {
    if (localStorage.getItem("account") != null && localStorage.getItem("password") != null) {
        login_logout_switching();
    }
}
check_login();

function to_logout() {
    localStorage.removeItem("account");
    localStorage.removeItem("password");
    localStorage.removeItem("cart");
    window.location.href = "/index.html";
}

function login_logout_switching() {
    let login_block = document.getElementById("hamburger_element_login");
    let logout_block = document.getElementById("hamburger_element_logout");

    if (login_block.style.display === "flex" || login_block.style.display === "") {
        login_block.style.display = "none";
        logout_block.style.display = "flex";
    } else {
        login_block.style.display = "flex";
        logout_block.style.display = "none";
    }
}
//--------------------------------------------------//

//---------------- change_function -----------------//
function function_switching() {
    var login_function = document.getElementById("login_function");
    var signup_function = document.getElementById("signup_function");

    if (login_function.style.display == "block" || login_function.style.display == "") {
        login_function.style.display = "none";
        signup_function.style.display = "block";
    } else {
        login_function.style.display = "block";
        signup_function.style.display = "none";
    }
}
//--------------------------------------------------//

//-------------- password visibility ---------------//
function login_password_visible() {
    var password = document.getElementById("login_password");
    var button = document.getElementById("login_password_visible_button");

    if (password.type == "password") {
        password.setAttribute("type", "text");
        button.style.backgroundImage = 'url("../src/password_visible.png")';
    } else {
        password.setAttribute("type", "password");
        button.style.backgroundImage = 'url("../src/password_invisible.png")';
    }
}

function signup_password_visible() {
    var password = document.getElementsByClassName("signup_password");
    var button = document.getElementsByClassName("signup_password_visible_button");

    if (password[0].type == "password" && password[1].type == "password") {
        password[0].setAttribute("type", "text");
        password[1].setAttribute("type", "text");
        button[0].style.backgroundImage = 'url("../src/password_visible.png")';
        button[1].style.backgroundImage = 'url("../src/password_visible.png")';
    } else {
        password[0].setAttribute("type", "password");
        password[1].setAttribute("type", "password");
        button[0].style.backgroundImage = 'url("../src/password_invisible.png")';
        button[1].style.backgroundImage = 'url("../src/password_invisible.png")';
    }
}
//--------------------------------------------------//

//-------------------- backend ---------------------//
document.addEventListener("DOMContentLoaded", function () {
    var login_button = document.getElementById("login_button");
    var login_account = document.querySelector("#login_form input[name=account]");
    var login_password = document.querySelector("#login_form input[name=password]");

    login_button.addEventListener("click", function (event) {
        event.preventDefault();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/login/login", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "text";

        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = xhr.response;
                console.log(data);
                var minder = document.getElementById("login_minder");
                if (data === "has this id") {
                    set_local_storage(login_account, login_password);
                    login_logout_switching();
                    window.location.href = "/index.html";
                } else if (data === "wrong password") {
                    minder.innerHTML = `<p>密碼錯誤</p>`;
                } else if (data === "no such id") {
                    minder.innerHTML = `<p>不存在此帳號</p>`;
                } else {
                    console.log("unknown response");
                }
            } else {
                console.log("request failed");
            }
        };

        xhr.onerror = function () {
            console.log("request error");
        };

        let requestData = {
            account: login_account.value,
            password: login_password.value,
        };

        xhr.send(JSON.stringify(requestData));
    });

    var signup_button = document.getElementById("signup_button");
    var signup_account = document.querySelector("#signup_form input[name=account]");
    var signup_password = document.querySelector("#signup_form input[name=password]");
    var signup_password_again = document.querySelector("#signup_form input[name=password_again]");

    signup_button.addEventListener("click", function (event) {
        event.preventDefault();

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/login/signup", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "text";

        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = xhr.response;
                console.log(data);
                var minder = document.getElementById("signup_minder");
                if (data === "incorresponding password") {
                    minder.innerHTML = `<p>兩次密碼不相同</p>`;
                } else if (data === "account exist already") {
                    minder.innerHTML = `<p>已存在帳號</p>`;
                } else {
                    set_local_storage(signup_account, signup_password);
                    window.location.href = "/index.html";
                }
            } else {
                console.log("request failed");
            }
        };

        xhr.onerror = function () {
            console.log("request error");
        };

        let requestData = {
            account: signup_account.value,
            password: signup_password.value,
            password_again: signup_password_again.value,
        };

        xhr.send(JSON.stringify(requestData));
    });
});

function set_local_storage(login_account, login_password) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login/data", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("request success");
            const data = xhr.response;
            console.log(data);
            localStorage.setItem("account", login_account.value);
            localStorage.setItem("password", login_password.value);
            localStorage.setItem("cart", JSON.stringify(data.cart));
        } else {
            console.log("request failed");
        }
    };

    xhr.onerror = function () {
        console.log("request error");
    };

    const requestData = {
        account: login_account.value,
        password: login_password.value,
    };

    xhr.send(JSON.stringify(requestData));
}

//--------------------------------------------------//

// function print_local_storage() {
//     const account = localStorage.getItem("account");
//     const password = localStorage.getItem("password");
//     const cart = localStorage.getItem("cart");

//     console.log(account);
//     console.log(password);
//     console.log(cart);
// }
