// variables
const alret = document.querySelector("#alret");
const header = document.querySelector("#header");
const Name = document.querySelector("#item_name_input");
const addBtn = document.querySelector("#add_btn");
const container = document.querySelector(".list");
const list = document.querySelector("#itmes_container");
const clear = document.querySelector("#clear_btn");
// edit variables
let editElement;
let editFlag = false;
let editId = "";
// adding and editing and  deleteing items
header.addEventListener("submit", function (e) {
  // preventDefault
  e.preventDefault();
  // item name
  const value = Name.value;
  // item unique id
  const id = new Date().getTime().toString();
  // add item if the input is not empty
  if (value !== "" && editFlag === false) {
    saveItemToLocalStorage(id, value);
    displayalret("Item added to the list", "green");
    container.createAttribute("class", "show-list");
    // deafualt
    setBackToDefault();
    // save to local storage
    addToLocalStorage(id, value);
  }
  // edit item name
  else if (value !== "" && editFlag === true) {
    editElement.innerHTML = value;
    displayalret("Item name edited", "green");
    // default // save to local storage
    setBackToDefault();
    // default
    addToLocalStorage(editId, value);
  }
  // shows a alret if the input is empty
  else {
    displayalret("Please write something first", "red");
  }
});

// alret function
function displayalret(text, action) {
  alret.textContent = text;
  alret.classList.add(`alret-${action}`);

  setTimeout(function () {
    alret.textContent = "";
    alret.classList.remove(`alret-${action}`);
  }, 1000);
}
// clearing all items
clear.addEventListener("click", function () {
  const items = document.querySelectorAll(".item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.removeAttribute("class", "show-list");
  displayalret("All items cleared ", "red");
  // default // save to local storage
  setBackToDefault();
  // removing from local storage
  localStorage.removeItem("list");
});
// setting back to default default
function setBackToDefault() {
  Name.value = "";
  editFlag = false;
  editId = "";
  addBtn.textContent = "submit";
}
// local storage
// removing the item from the local storage
function removeFromLocalStorage(id) {
  let items = getFromLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// adding item to the local storage
function addToLocalStorage(id, value) {
  const storage = { id, value };
  let items = getFromLocalStorage();
  items.push(storage);
  localStorage.setItem("list", JSON.stringify(items));
}
// getting the item from the local storage
function getFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// editing item from local storage
function editLocalStorage(id, value) {
  let items = getFromLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// saving item to local storage
function saveItemToLocalStorage(id, value) {
  // adding item to javascript
  const element = document.createElement("article");
  element.classList.add("item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  // item
  element.innerHTML = `<p class="item_name">${value}</p>
   <div class="btn_container">
   <button class="edit"><i class="fa-solid fa-pen-to-square icon"></i></button>
     
   <button  class="delete"><i class="fa-solid fa-trash icon"></i></button>
   </div>`;
  // add item

  // local storage

  // delete item
  const Delete = element.querySelector(".delete");
  Delete.addEventListener("click", function (e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
      container.classList.remove("show");
    }
    displayalret("item removed", "red");
    setBackToDefault();
    removeFromLocalStorage(id);
  });
  // picking item name to edit it
  const edit = element.querySelector(".edit");

  edit.addEventListener("click", function (e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    Name.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    addBtn.textContent = "edit";
  });
  list.appendChild(element);
}
//saving items even if the page refreshes
window.addEventListener("DOMContentLoaded", function () {
  let items = getFromLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      saveItemToLocalStorage(item.id, item.value);
    });
    container.classList.add("show-list");
  }
});
