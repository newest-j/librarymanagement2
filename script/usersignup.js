import { getAllUsers, setInitialUsersData } from "./utils.js";

const signUp = document.getElementById("signup");

let users = JSON.parse(localStorage.getItem("users"))

if(!users){
 await setInitialUsersData()
 users = getAllUsers();
}

signUp.addEventListener('click', (e) => {
    e.preventDefault();

    const userName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();


    function generateId() {
        return Math.floor(Math.random() * 1000000);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(userName == "" || password == "" || email == ""){
        alert("Input required");
        return;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("emailvalid").innerHTML = "Invalid password (e.g., ibukunagbaoye@gmail.com)"
        return;
    }

    if (password.length < 8) {
        document.getElementById("passwordvalid").innerHTML = "Password must be at least 8 characters long"
        return;
    }

    let user = {
        id: generateId(),
        userName,
        email,
        password,
        role : "member",
        borrowedBooks:[],
        savedBooks:[],
        booksRead:[]
    }

    console.log(user);

    let existingData = JSON.parse(localStorage.getItem("users")) || [];
    existingData.push(user);

    localStorage.setItem("users",  JSON.stringify(existingData));
    alert("Registration successful")
    window.location.href = "/html/signin.html"

})





