const STORAGE_KEY = "data";

let list = [];

// fungsi pengecekan apakah storage ada
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// fungsi penyimpanan data ke storage
function saveData(text /* String */) {
  const parsed = JSON.stringify(list);
  localStorage.setItem(STORAGE_KEY, parsed);
  message(text);
  refreshDataFromList();
}

// fungsi pengambilan data dari storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) list = data;
  document.dispatchEvent(new Event("ondataloaded"));
}

// fungsi update data
function updateDataToStorage(text /* String */) {
  if (isStorageExist()) saveData(text);
}

// fungsi membuat objek baru
function composeBookObject(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
}

// fungsi pencarian data
function findBook(bookId) {
  for (book of list) {
    if (book.id === bookId) return book;
  }
  return null;
}

// fungsi pencarian index data
function findBookIndex(bookId) {
  let index = 0;
  for (book of list) {
    if (book.id === bookId) {
      return index;
    }

    index++;
  }

  return -1;
}

function refreshDataFromList() {
  const listUncompleted = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
  let listCompleted = document.getElementById(COMPLETED_READ_BOOK_ID);
  let listCard = document.querySelectorAll(".card");

  listCard.forEach((e) => {
    e.remove();
  });

  for (book of list) {
    const newBook = makeBook(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );
    newBook[BOOK_ID] = book.id;

    if (book.isComplete) {
      listCompleted.append(newBook);
    } else {
      listUncompleted.append(newBook);
    }
  }
  isEmpty(listUncompleted, listCompleted, true);
}

function searchDataFromList(type, text = undefined) {
  const listUncompleted = document.getElementById(UNCOMPLETED_READ_BOOK_ID);

  let listCompleted = document.getElementById(COMPLETED_READ_BOOK_ID);
  let listCard = document.querySelectorAll(".card");
  let newBook;
  let filteredBook;

  if (text != undefined) {
    filteredBook = list.filter((book) => {
      if (type == "title") {
        return book.title.toLowerCase().includes(text.toLowerCase());
      } else if (type == "author") {
        return book.author.toLowerCase().includes(text.toLowerCase());
      } else {
        return book.year.toLowerCase().includes(text.toLowerCase());
      }
    });
  } else {
    filteredBook = list;
  }

  listCard.forEach((e) => {
    e.remove();
  });

  for (book of filteredBook) {
    newBook = makeBook(book.title, book.author, book.year, book.isComplete);
    newBook[BOOK_ID] = book.id;
    if (book.isComplete) {
      listCompleted.append(newBook);
    } else {
      listUncompleted.append(newBook);
    }
  }
  isEmpty(listUncompleted, listCompleted, false);
}

function isEmpty(
  listUncompleted /* HTML Element */,
  listCompleted /* HTML Element */,
  normal /* boolean */
) {
  const emptyListCompleted = document.querySelector(
    ".listRead .container .cover .noList"
  );
  const emptyListUnCompleted = document.querySelector(
    ".listNotRead .container .cover .noList"
  );
  if (!normal) {
    if (
      listUncompleted.children.length == 1 &&
      listCompleted.children.length == 1
    ) {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Buku Tidak Ditemukan";
      unHidden(emptyListUnCompleted);
      unHidden(emptyListCompleted);
    } else if (
      listUncompleted.children.length == 1 &&
      listCompleted.children.length >= 1
    ) {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      unHidden(emptyListUnCompleted);
      hidden(emptyListCompleted);
    } else if (
      listUncompleted.children.length >= 1 &&
      listCompleted.children.length == 1
    ) {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      unHidden(emptyListCompleted);
      hidden(emptyListUnCompleted);
    } else {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      hidden(emptyListUnCompleted);
      hidden(emptyListCompleted);
    }
  } else {
    if (
      listUncompleted.children.length == 1 &&
      listCompleted.children.length == 1
    ) {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      unHidden(emptyListUnCompleted);
      unHidden(emptyListCompleted);
    } else if (
      listUncompleted.children.length == 1 &&
      listCompleted.children.length >= 1
    ) {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      unHidden(emptyListUnCompleted);
      hidden(emptyListCompleted);
    } else if (
      listUncompleted.children.length >= 1 &&
      listCompleted.children.length == 1
    ) {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      unHidden(emptyListCompleted);
      hidden(emptyListUnCompleted);
    } else {
      emptyListUnCompleted.innerHTML = emptyListCompleted.innerHTML =
        "Tidak Ada Buku";
      hidden(emptyListUnCompleted);
      hidden(emptyListCompleted);
    }
  }
}
