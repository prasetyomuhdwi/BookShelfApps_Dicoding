const UNCOMPLETED_READ_BOOK_ID = "listNotRead";
const COMPLETED_READ_BOOK_ID = "listRead";
const BOOK_ID = "itemId";

function makeBook(
  title /* string */,
  author /* string */,
  year /* string */,
  isComplete /* boolean*/
) {
  const titleText = document.createElement("h2");
  titleText.className = "title";
  titleText.innerHTML = title;

  let authorName = document.createElement("p");
  authorName.className = "author";
  authorName.innerHTML = author;

  let bookYear = document.createElement("p");
  bookYear.className = "year";
  bookYear.innerHTML = year;

  let cardMenu = document.createElement("img");
  cardMenu.alt = "menu";
  cardMenu.src = "./svg/menu.svg";
  cardMenu.className = "menu";

  cardMenu.addEventListener("click", function () {
    if (cardPopup.hidden) {
      unHidden(cardPopup);
    } else {
      hidden(cardPopup);
    }
  });

  const content = document.createElement("DIV");
  content.className = "content";

  const cardPopup = document.createElement("DIV");
  cardPopup.className = "popup";
  cardPopup.hidden = true;
  cardPopup.append(content);

  const subtitleCard = document.createElement("DIV");
  subtitleCard.className = "subtitleCard";
  subtitleCard.append(authorName, bookYear);

  const option = document.createElement("DIV");
  option.className = "option";
  option.append(cardMenu, cardPopup);

  const card = document.createElement("DIV");
  card.className = "card";
  card.append(titleText, subtitleCard, option);

  if (isComplete) {
    content.append(
      createUndoButton(isComplete, card),
      createEditButton(card, true),
      createDeleteButton(card)
    );
  } else {
    content.append(
      createUndoButton(isComplete, card),
      createEditButton(card, false),
      createDeleteButton(card)
    );
  }

  return card;
}

function createUndoButton(
  isComplete /* boolean */,
  cardElement /* HTMLELement */
) {
  if (isComplete) {
    return createButton(
      "item",
      "book",
      "./svg/book.svg",
      " Belum Selesai Dibaca",
      function () {
        undoBookFromCompleted(cardElement);
      }
    );
  } else {
    return createButton(
      "item",
      "book",
      "./svg/book.svg",
      " Selesai Dibaca",
      function () {
        addBookToCompleted(cardElement);
      }
    );
  }
}

function createDeleteButton(cardElement) {
  return createButton(
    "item",
    "book",
    "./svg/del.svg",
    "Hapus",
    function (event) {
      removeBookFromCompleted(cardElement);
    }
  );
}

function createEditButton(cardElement, isComplete) {
  return createButton(
    "item",
    "book",
    "./svg/edit.svg",
    "Ubah",
    function (event) {
      hidden(event.target.parentElement.parentElement);
      editInit(cardElement, isComplete);
    }
  );
}

function editInit(element, isComplete) {
  let edit = document.getElementById("sectionEdit");
  let title = document.forms["formEdit"]["title"];
  let author = document.forms["formEdit"]["author"];
  let year = document.forms["formEdit"]["year"];

  title.value = element.querySelector(".title").innerText;
  author.value = element.querySelector(".author").innerText;
  year.value = element.querySelector(".year").innerText;

  const submitForm /* HTMLFormElement */ = document.getElementById("formEdit");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    editBook(element, isComplete);
  });

  unHidden(edit);
}

function createButton(
  buttonTypeClass /* string */,
  imgAlt /* string */,
  imgSrc /* string */,
  itemText /* string */,
  eventListener /* callback function */
) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });

  const Img = document.createElement("img");
  Img.className = "icon";
  Img.alt = imgAlt;
  Img.src = imgSrc;

  const itemP = document.createElement("p");
  itemP.innerHTML = itemText;

  button.append(Img, itemP);

  return button;
}

//fungsi menyembunyikan dan menampilkan element
function hidden(element) {
  if (!element.attributes.getNamedItem("hidden")) {
    let hidden = document.createAttribute("hidden");
    return element.attributes.setNamedItem(hidden);
  }
}
function unHidden(element) {
  if (element.attributes.getNamedItem("hidden")) {
    return element.attributes.removeNamedItem("hidden");
  }
}

function addBook() {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
  const title = document.getElementById("title").value;
  const isComplete = document.getElementById("isComplete").checked;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const book = makeBook(title, author, year, isComplete);
  const bookObject = composeBookObject(title, author, year, isComplete);
  book[BOOK_ID] = bookObject.id;

  list.push(bookObject);

  uncompletedBookList.append(book);
  updateDataToStorage("Data Buku Berhasil Ditambahkan");
}

function editBook(bookElement /* HTMLELement */, isComplete) {
  let listEdit;
  let title = document.forms["formEdit"]["title"].value;
  let author = document.forms["formEdit"]["author"].value;
  let year = document.forms["formEdit"]["year"].value;

  const newBook = makeBook(title, author, year, isComplete);
  const book = findBook(bookElement[BOOK_ID]);

  if (isComplete) {
    listEdit = document.getElementById(COMPLETED_READ_BOOK_ID);
  } else {
    listEdit = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
  }
  book.title = title;
  book.author = author;
  book.year = year;
  book.isComplete = isComplete;
  newBook[BOOK_ID] = book.id;

  listEdit.append(newBook);
  bookElement.remove();

  updateDataToStorage("Data Buku Berhasil Diubah");
}

function addBookToCompleted(bookElement /* HTMLELement */) {
  const listCompleted = document.getElementById(COMPLETED_READ_BOOK_ID);
  const title = bookElement.querySelector(".title").innerText;
  const year = bookElement.querySelector(".subtitleCard .year").innerText;
  const author = bookElement.querySelector(".subtitleCard .author").innerText;
  const newBook = makeBook(title, author, year, true);
  const book = findBook(bookElement[BOOK_ID]);
  book.isComplete = true;
  newBook[BOOK_ID] = book.id;

  listCompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage("Data Buku Berhasil Diubah");
}

function removeBookFromCompleted(bookElement /* HTMLELement */) {
  const bookPosition = findBookIndex(bookElement[BOOK_ID]);
  list.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage("Data Buku Berhasil Dihapus");
}

function undoBookFromCompleted(bookElement /* HTMLELement */) {
  const listUncompleted = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
  const title = bookElement.querySelector(".title").innerText;
  const year = bookElement.querySelector(".subtitleCard .year").innerText;
  const author = bookElement.querySelector(".subtitleCard .author").innerText;

  const newBook = makeBook(title, year, author);

  const book = findBook(bookElement[BOOK_ID]);
  book.isComplete = false;
  newBook[BOOK_ID] = book.id;

  listUncompleted.append(newBook);
  bookElement.remove();
  isComplete;
  updateDataToStorage("Data Buku Berhasil Diubah");
}

// Feature search
const inputSearch /* HTMLFormElement */ = document.getElementById("search");
const btnReset /* HTMLFormElement */ = document.getElementById("btnSearch");
inputSearch.addEventListener("keyup", (e) => {
  if (e.target.value !== "") {
    searchDataFromList(
      document.forms["formSearch"]["select"].value,
      e.target.value
    );
    unHidden(btnReset);
  } else {
    searchDataFromList(document.forms["formSearch"]["select"].value);
    hidden(btnReset);
  }
});

btnReset.addEventListener("click", function (event) {
  searchDataFromList(document.forms["formSearch"]["select"].value);
});
