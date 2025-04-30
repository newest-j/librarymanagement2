import { recommendedBooks , signout} from "./utils.js";

// signout
document.getElementById("signout").addEventListener('click' , ()=>{
     signout()
})

// date
const date = document.getElementById("date");
date.innerHTML = new Date().toDateString();

// profile
const userProfile = JSON.parse(localStorage.getItem("profile")); 
const headerprofile = document.getElementById("headerimage")
if (userProfile) {
   headerprofile.src = userProfile.image;
}

const data = await recommendedBooks();
const recommendedBooksBody = document.getElementById("recommendedbooks");
const itemsPerPage = 12; // Number of books to display per page
let currentPage = 1;

// Search input reference
const searchInput = document.getElementById("searchInput");

// Function to render books based on the current page
function renderBooks() {
    // Clear the current books
    recommendedBooksBody.innerHTML = '';

    // Get the search query
    const searchQuery = searchInput.value.toLowerCase().trim();

    // Filter books by title based on search input
    const filteredBooks = data.filter(book => book.title.toLowerCase().includes(searchQuery));

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    // Create book cards for the current page
    paginatedBooks.forEach(book => {
        const col = document.createElement("div");
        col.className = "col-md-2";
        col.innerHTML = `
            <div class="book-card">
                <img src="${book.cover_url}" alt="Book">
                <p>${book.title}</p>
                <small>${book.author}</small>
              <a href="${book.read_link}" target="_blank" class="btn btn-primary btn-sm">Read Book</a>
              <button  class="btn btn-primary mt-2" id="borrow" >Borrow</button>
            </div>
        `;
        recommendedBooksBody.appendChild(col);

        const bookBorrowed = col.querySelector("#borrow");
        const users = JSON.parse(localStorage.getItem("users"));
        const currentUser = JSON.parse(localStorage.getItem("currentuserid"));
        const foundUser = users.find(user => user.id == currentUser);

        const alreadyBorrowed = foundUser.borrowedBooks.some(b => b.title === book.title);

        if (alreadyBorrowed) {
            bookBorrowed.innerHTML = "out of stock";
            bookBorrowed.disabled = true;
        } else {
            bookBorrowed.addEventListener('click', () => {
                // Add book to borrowedBooks
                foundUser.borrowedBooks.push({
                    title: book.title,
                    author: book.author,
                    coverURL: book.cover_url,
                    readLink: book.read_link
                });
    
                // Save updated users array to local storage
                localStorage.setItem("users", JSON.stringify(users));
    
                // Update button UI
                bookBorrowed.innerHTML = "Borrowed";
                bookBorrowed.disabled = true;
            });
        }
    });

    // Update pagination
    updatePagination(filteredBooks);
}

// Function to update pagination controls
function updatePagination(filteredData = data) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Previous button
    const prevButton = document.createElement('li');
    prevButton.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    prevButton.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks();
        }
    });
    pagination.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.className = 'page-item' + (currentPage === i ? ' active' : '');
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderBooks();
        });
        pagination.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('li');
    nextButton.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBooks();
        }
    });
    pagination.appendChild(nextButton);
}

// Initial render
renderBooks();

// Re-render when typing in the search input
searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderBooks();
});

// the fetch books with open library
// function to fetch all the books and save it to locastorage
const subjects = ['fiction', 'fantasy',
    'romance', 'mystery', 'thriller',
    'historical_fiction', 'education', 'religion', 'art'];

// function to fetch all the books and save it to localStorage
async function getBooksFromSubjects() {
    const allBooks = [];

    for (let subject of subjects) {
        const response = await fetch(`https://openlibrary.org/subjects/${subject}.json`);
        const data = await response.json();

        const books = data.works.map(book => {
            const authorNames = book.authors
                ? book.authors.map(author => author.name).join(', ')
                : "Unknown author";

            const coverURL = book.cover_id
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                : "https://placehold.co/150x200?text=No+Cover";

            const readLink = book.key
                ? `https://openlibrary.org${book.key}`
                : "#";

            return {
                title: book.title || "No title",
                author: authorNames,
                year: book.first_publish_year || "N/A",
                coverURL: coverURL,
                subject: subject,
                readLink: readLink
            };
        });

        allBooks.push(...books);
    }

    localStorage.setItem("books", JSON.stringify(allBooks));
    return allBooks;
}

getBooksFromSubjects();
