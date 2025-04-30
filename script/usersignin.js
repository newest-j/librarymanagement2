import { getAllUsers, setInitialUsersData } from "./utils.js";

const signIn = document.getElementById("signin");

let users = JSON.parse(localStorage.getItem("users"));

if (!users) {
    await setInitialUsersData();
    users = getAllUsers();
} else {
    users = getAllUsers(); 
}

const isLoggedIn = localStorage.getItem('currentuserid');

if (isLoggedIn) {
    const currentUserId = JSON.parse(isLoggedIn);
    const currentUser = users.find(user => user.id === currentUserId);

    if (currentUser) {
        if (currentUser.role === "admin") {
            window.location.href = "/";
        } else if (currentUser.role === "librarian") {
            window.location.href = "/";
        } else {
            window.location.href = "/html/userdashboard.html";
        }
    }
}

signIn.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (password === "" || email === "") {
        alert("Input required");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users"));
    const myUser = users.find(user => user.email === email && user.password === password);

    if (!myUser) {
       document.getElementById("check").innerHTML = "Incorrect password or email"
        return;
    }

    localStorage.setItem("currentuserid", JSON.stringify(myUser.id));

    if (myUser.role === "admin") {
        window.location.href = "/";
    } else if (myUser.role === "librarian") {
        window.location.href = "/";
    } else if (myUser.role === "member") {
        window.location.href = "/html/userdashboard.html";
    } else {
        alert("Unknown user role.");
    }
});

