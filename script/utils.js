export const recommendedBooks = async () =>{
   const response = await fetch('/data/book.json');
   const data = await response.json();

    return data;
}

export const setInitialUsersData = async () => {
    const data = await fetch("../data/data.json")
    const users = await data.json();

    if (users) {
        localStorage.setItem("users", JSON.stringify(users))
    }
}

export const getAllUsers = () => {
    return JSON.parse(localStorage.getItem("users"))
}

export const signout = () => {
    localStorage.removeItem("currentuserid");
    window.location.href = "/index.html"

}