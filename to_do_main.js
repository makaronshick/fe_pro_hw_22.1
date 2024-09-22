"use strict";

const STORAGE_NAME = "toDoListItems";

const inputElement = $(".form__input").get(0);
const listElement = $("ul").get(0);
const addBtnElement = $(".form__btn").get(0);

$(addBtnElement).on("click", () => {
  if (inputElement.value.trim()) {
    const task = {
      id: "id_" + Date.now(),
      text: inputElement.value.trim(),
      isChecked: false,
    };

    renderLi(task);

    if (localStorage.getItem(STORAGE_NAME)) {
      const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));

      storageData.push(task);
      localStorage.setItem(STORAGE_NAME, JSON.stringify(storageData));
    } else {
      localStorage.setItem(STORAGE_NAME, JSON.stringify([task]));
    }

    inputElement.value = "";
  } else {
    alert("Task can't be empty!");
  }
});

$(listElement).on("click", (event) => {
  if (event.target.className !== "todo-item__delete") {
    return;
  }

  const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
  const { parentElement } = event.target;

  const result = storageData.filter(
    (task) => task.id !== parentElement.id
  );

  if (result.length > 0) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(result));
  } else {
    localStorage.clear();
  }

  $(parentElement.childNodes[0]).off("click", checkboxFunc);
  parentElement.remove();
});

const checkboxFunc = (event) => {
  const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
  const { parentElement } = event.target;

  const result = storageData.map((task) => {
    if (task.id === parentElement.id) {
      task.isChecked = event.target.checked;
      
    }

    return task;
  });

  const currentLiSpanElement = parentElement.childNodes[1];

  if (event.target.checked) {
    currentLiSpanElement.classList.add("todo-item--checked");
  } else {
    currentLiSpanElement.classList.remove("todo-item--checked");
  }

  localStorage.setItem(STORAGE_NAME, JSON.stringify(result));
};

function renderLi(task) {
  const itemElement = $("<li/>", {
    type: "li",
    class: "todo-item",
    id: task.id,
  }).get(0);

  const itemCheckboxElement = $("<input/>", {
    type: "checkbox",
    class: "checkbox-item",
    checked: task.isChecked

  });
  itemCheckboxElement.on("click", checkboxFunc);

  const itemSpanElement = $("<span/>", {
    type: "span",
    class: "todo-item__description",
    text: task.text,
  });

  if (task.isChecked) {
    itemSpanElement.addClass("todo-item--checked");
  }

  const delBtnElement = $("<button/>", {
    type: "button",
    class: "todo-item__delete",
    text: "Delete task",
  }).get(0);

  itemElement.append(
    itemCheckboxElement[0],
    itemSpanElement[0],
    delBtnElement
  );
  listElement.append(itemElement);
}

function init() {
  if (localStorage.getItem(STORAGE_NAME)) {
    const storageData = JSON.parse(localStorage.getItem(STORAGE_NAME));

    storageData.forEach((element) => {
      renderLi(element);
    });
  }
}

init();

export default init;
