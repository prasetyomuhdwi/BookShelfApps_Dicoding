document.addEventListener("DOMContentLoaded", function () {
  const submitForm /* HTMLFormElement */ = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const emptyListCompleted = document.querySelector(
    ".listRead .container .cover .noList"
  );
  const emptyListUnCompleted = document.querySelector(
    ".listNotRead .container .cover .noList"
  );

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function message(text /* string */) {
  alert(text);
}

document.addEventListener("ondataloaded", () => {
  refreshDataFromList();
});
