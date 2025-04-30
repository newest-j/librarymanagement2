import { signout } from "./utils.js";

// signout
document.getElementById("signout").addEventListener('click' , ()=>{
     signout()
})

const users = JSON.parse(localStorage.getItem("users"));
const currentUser = JSON.parse(localStorage.getItem("currentuserid"));
const foundUser = users.find(user => user.id == currentUser);

const myshelf = document.querySelector('#myshelf');

// date
const date = document.getElementById("date");
date.innerHTML = new Date().toDateString();

// profile
const userProfile = JSON.parse(localStorage.getItem("profile")); 
const headerprofile = document.getElementById("headerimage")
if (userProfile) {
   headerprofile.src = userProfile.image;
}

// Search input reference
const searchInput = document.getElementById("searchInput");

// function to render shelf books
function renderShelfBooks(searchTerm = '') {
    myshelf.innerHTML = ''; // Clear current shelf

    foundUser.borrowedBooks
        .filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .forEach((book, index) => {
            const content = document.createElement("div");
            content.classList.add("col");

            content.innerHTML = `
                <div class="card bg-dark text-light h-100 p-2">
                    <div class="text-center">
                        <img class="img-fluid mb-2 rounded" src="${book.coverURL}" alt="Book cover"
                            width="70" height="90">
                        <p class="mb-1">${book.title}</p>
                        <p class="mb-2">${book.author}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm w-100 mb-1" disabled>Borrowed</button>
                    <button class="btn btn-outline-warning btn-sm w-100 return-btn">Return</button>
                    <a href="${book.readLink}" target="_blank" class="btn btn-outline-warning btn-sm w-100">Read Book</a>
                </div>
            `;

            myshelf.appendChild(content);

            const returnBtn = content.querySelector(".return-btn");
            returnBtn.addEventListener('click', () => {
                // Remove book from UI
                content.remove();

                // Remove from user's borrowedBooks
                foundUser.borrowedBooks.splice(index, 1);

                // Update localStorage
                localStorage.setItem("users", JSON.stringify(users));
            });
        });
}

// initial render
renderShelfBooks();

// listen to search input
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    renderShelfBooks(query);
});
