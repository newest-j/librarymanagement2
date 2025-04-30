import { signout } from "./utils.js";

// signout
document.getElementById("signout").addEventListener('click', () => {
    signout()
})


const updateName = document.getElementById("name");
const updateEmail = document.getElementById("mail");
const updateSavedBooks = document.getElementById("booksaved");
const updateProflie = document.getElementById("profileImage");
const submitBtn = document.getElementById("submit");
const headerprofile = document.getElementById("headerimage")
const users = JSON.parse(localStorage.getItem("users"));
const currentUser = JSON.parse(localStorage.getItem("currentuserid"));
const foundUser = users.find(user => user.id == currentUser);
const date = document.getElementById("date");

date.innerHTML = new Date().toDateString();
if (foundUser) {
    updateSavedBooks.innerText = foundUser.borrowedBooks.length;


    // initial profile
    updateName.innerHTML = foundUser.userName;
    updateEmail.innerHTML = foundUser.email;

    document.getElementById("fullName").value = foundUser.userName;
    document.getElementById("email").value = foundUser.email;

}





// update the profile
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const imageInput = document.getElementById("profilePic");
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        // console.log(reader)
        reader.onload = function () {
            const imageUrl = reader.result; // Base64 string
            updateProflie.src = imageUrl;

            updateName.innerHTML = fullName;
            updateEmail.innerHTML = email;

            const data = {
                fullName,
                email,
                image: imageUrl
            };

            localStorage.setItem("profile", JSON.stringify(data));
        };
        reader.readAsDataURL(file); // Converts to Base64
    } else {
        updateName.innerHTML = fullName;
        updateEmail.innerHTML = email;

        const data = {
            fullName,
            email,
            image: updateProflie.src
        };

        localStorage.setItem("profile", JSON.stringify(data));
    }
});

const userProfile = JSON.parse(localStorage.getItem("profile"));
if (userProfile) {
    document.getElementById("fullName").value = userProfile.fullName;
    document.getElementById("email").value = userProfile.email;

    updateName.innerHTML = userProfile.fullName;
    updateEmail.innerHTML = userProfile.email;
    updateProflie.src = userProfile.image;

   
}
