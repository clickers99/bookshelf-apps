// Fungsi untuk mendapatkan data buku dari localStorage
function getBooksFromLocalStorage() {
  const booksJSON = localStorage.getItem("books");
  return JSON.parse(booksJSON) || [];
}

// Fungsi untuk menyimpan data buku ke localStorage
function saveBooksToLocalStorage(books) {
  const booksJSON = JSON.stringify(books);
  localStorage.setItem("books", booksJSON);
}

// Fungsi untuk menampilkan daftar buku pada rak tertentu
function renderBooks(shelfId) {
  const shelf =
    shelfId === "incompleteBookshelfList"
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
  const books = getBooksFromLocalStorage();

  const bookList = document.getElementById(shelfId);
  bookList.innerHTML = "";

  for (const book of books) {
    if (
      (shelfId === "incompleteBookshelfList" && !book.isComplete) ||
      (shelfId === "completeBookshelfList" && book.isComplete)
    ) {
      // Membuat elemen untuk setiap buku
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");

      const h3 = document.createElement("h3");
      h3.textContent = book.title;

      const authorPara = document.createElement("p");
      authorPara.textContent = `Penulis: ${book.author}`;

      const yearPara = document.createElement("p");
      yearPara.textContent = `Tahun: ${book.year}`;

      const actionDiv = document.createElement("div");
      actionDiv.classList.add("action");

      // Membuat tombol untuk memindahkan buku
      const moveButton = document.createElement("button");
      moveButton.textContent =
        shelf === "Belum selesai dibaca"
          ? "Selesai dibaca"
          : "Belum selesai dibaca";
      moveButton.classList.add("green");
      moveButton.addEventListener("click", () =>
        moveBook(book.id, shelf === "Belum selesai dibaca")
      );

      // Membuat tombol untuk menghapus buku
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus buku";
      deleteButton.classList.add("red");
      deleteButton.addEventListener("click", () => deleteBook(book.id));

      // Menambahkan elemen-elemen ke dalam elemen buku
      actionDiv.appendChild(moveButton);
      actionDiv.appendChild(deleteButton);

      bookItem.appendChild(h3);
      bookItem.appendChild(authorPara);
      bookItem.appendChild(yearPara);
      bookItem.appendChild(actionDiv);

      // Menambahkan elemen buku ke dalam rak
      bookList.appendChild(bookItem);
    }
  }
}

// Fungsi untuk menambahkan buku baru
function addBook() {
  const titleInput = document.getElementById("inputBookTitle");
  const authorInput = document.getElementById("inputBookAuthor");
  const yearInput = document.getElementById("inputBookYear");
  const isCompleteInput = document.getElementById("inputBookIsComplete");

  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value);
  const isComplete = isCompleteInput.checked;

  if (title && author && year) {
    // Membuat objek buku baru
    const newBook = {
      id: Date.now(),
      title,
      author,
      year,
      isComplete,
    };

    // Mendapatkan daftar buku dari localStorage
    const books = getBooksFromLocalStorage();

    // Menambahkan buku baru ke daftar buku
    books.push(newBook);

    // Menyimpan daftar buku yang telah diperbarui ke localStorage
    saveBooksToLocalStorage(books);

    // Mengosongkan input fields
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;

    // Merender ulang rak buku
    renderBooks("incompleteBookshelfList");
    renderBooks("completeBookshelfList");

    // Menampilkan pesan peringatan
    Swal.fire("Berhasil ditambahkan!", "", "success");
  }
}

// Fungsi untuk memindahkan buku antar rak
function moveBook(bookId, toCompleteShelf) {
  const books = getBooksFromLocalStorage();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    // Memindahkan buku ke rak yang sesuai
    books[index].isComplete = toCompleteShelf;

    // Menyimpan perubahan ke dalam localStorage
    saveBooksToLocalStorage(books);

    // Merender ulang rak buku
    renderBooks("incompleteBookshelfList");
    renderBooks("completeBookshelfList");

    // Menampilkan pesan peringatan
      Swal.fire(`Berhasil dipindahkan ke rak "${toCompleteShelf ? "Selesai dibaca" : "Belum selesai dibaca"}"!`, "", "success");
  }
}

// Fungsi untuk menghapus data buku
function deleteBook(bookId) {
  const books = getBooksFromLocalStorage();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    // Menghapus buku dari daftar buku
    books.splice(index, 1);

    // Menyimpan perubahan ke dalam localStorage
    saveBooksToLocalStorage(books);

    // Merender ulang rak buku
    renderBooks("incompleteBookshelfList");
    renderBooks("completeBookshelfList");

    // Menampilkan pesan peringatan
    Swal.fire("Berhasil dihapus!", "", "success");
  }
}

// Event listener untuk form penambahan buku
const inputBookForm = document.getElementById("inputBook");
inputBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addBook();
});

// Event listener untuk form pencarian buku (opsional)
const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTitleInput = document.getElementById("searchBookTitle");
  const searchTitle = searchTitleInput.value.toLowerCase();
  
  // Mendapatkan daftar buku dari localStorage
  const books = getBooksFromLocalStorage();
  
  // Filter buku berdasarkan judul yang sesuai dengan pencarian
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  
  // Mendapatkan elemen HTML untuk menampilkan hasil pencarian
  const bookList = document.getElementById("searchBookResult");
  bookList.innerHTML = "";
  
  // Menampilkan buku-buku yang sesuai dengan hasil pencarian
  for (const book of filteredBooks) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const h3 = document.createElement("h3");
    h3.textContent = book.title;

    const authorPara = document.createElement("p");
    authorPara.textContent = `Penulis: ${book.author}`;

    const yearPara = document.createElement("p");
    yearPara.textContent = `Tahun: ${book.year}`;

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const moveButton = document.createElement("button");
    moveButton.textContent = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
    moveButton.classList.add("green");
    moveButton.addEventListener("click", () => moveBook(book.id, !book.isComplete));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    actionDiv.appendChild(moveButton);
    actionDiv.appendChild(deleteButton);

    bookItem.appendChild(h3);
    bookItem.appendChild(authorPara);
    bookItem.appendChild(yearPara);
    bookItem.appendChild(actionDiv);

    bookList.appendChild(bookItem);
  }
});

// Render daftar buku saat halaman pertama dimuat
renderBooks("incompleteBookshelfList");
renderBooks("completeBookshelfList");
