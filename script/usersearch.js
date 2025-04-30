import { signout } from "./utils.js";

// signout
document.getElementById("signout").addEventListener('click' , ()=>{
     signout()
})

const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentuserid"));
const foundUser = users.find(user => user.id === currentUser);
const books = JSON.parse(localStorage.getItem("books")) || [];

// date
const date = document.getElementById("date");
date.innerHTML = new Date().toDateString();



// profile

const userProfile = JSON.parse(localStorage.getItem("profile")); 
const headerprofile = document.getElementById("headerimage")
if (userProfile) {
   headerprofile.src = userProfile.image;
}


const searchBooks = document.querySelector("#table tbody");
const selectSubject = document.getElementById("categorySelect");


// initial books display
function displayBooks(bookList) {
    searchBooks.innerHTML = ""; // Clear any existing rows

    bookList.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="d-flex align-items-center gap-3">
                <img src="${book.coverURL}" width="50" class="rounded" alt="Book">
                ${book.title}
            </td>
            <td>${book.author}</td>
            <td>
                <span class="status-badge badge-in-shelf stock">In-Shelf</span><br>
                <button class="btn btn-danger mt-2 borrow-btn">Borrow</button>
            </td>
            <td>
                <a href="${book.readLink || '#'}" target="_blank" class="preview-btn">Preview</a>
            </td>
        `;

        searchBooks.appendChild(row);

        // Borrow logic
        const borrowBtn = row.querySelector(".borrow-btn");
        const stockDisplay = row.querySelector(".stock");

        const alreadyBorrowed = foundUser.borrowedBooks.some(b => b.title === book.title);

        if (alreadyBorrowed) {
            borrowBtn.textContent = "Out of Stock";
            stockDisplay.innerHTML = "Borrowed";
            borrowBtn.disabled = true;
        } else {
            borrowBtn.addEventListener("click", () => {
                foundUser.borrowedBooks.push({
                    title: book.title,
                    author: book.author,
                    coverURL: book.coverURL,
                    readLink: book.readLink
                });

                localStorage.setItem("users", JSON.stringify(users));

                borrowBtn.textContent = "Borrowed";
                borrowBtn.disabled = true;
            });
        }
    });
}

displayBooks(books.slice(0, 10)); 


// filter by option

selectSubject.addEventListener('change', () => {
    const selectedSubject = selectSubject.value;
    const filteredBooks = books.filter(book => book.subject === selectedSubject);
    displayBooks(filteredBooks);
});




// search input
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );

    displayBooks(filteredBooks);
});
