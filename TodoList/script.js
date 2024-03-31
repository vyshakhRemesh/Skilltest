let list = [];
let sort;
const inputElement = document.getElementById("input");

const listElement = document.getElementById("list");
const enterButton = document.getElementById("enter");
const detailsElement = document.getElementById("details");
const remainingTask = document.getElementById("taskRemaining");
const taskFunctions = document.getElementById("taskFunctions");
const completeButton = document.getElementById("completeButton");
const clearButton = document.getElementById("clearButton");
const allTab = document.getElementById("allTab");
const uncompleteTab = document.getElementById("uncompleteTab");
const completeTab = document.getElementById("completeTab");

allTab.addEventListener("click", () => {
  renderList("all");
});
uncompleteTab.addEventListener("click", () => {
  renderList("uncomplete");
});
completeTab.addEventListener("click", () => {
  renderList("complete");
});

function tabSelect(tab = "all") {
  if (tab === "all") {
    allTab.classList.add("selected");
    completeTab.classList.remove("selected");
    uncompleteTab.classList.remove("selected");
  } else if (tab === "complete") {
    completeTab.classList.add("selected");
    allTab.classList.remove("selected");
    uncompleteTab.classList.remove("selected");
  } else if (tab === "uncomplete") {
    uncompleteTab.classList.add("selected");
    allTab.classList.remove("selected");
    completeTab.classList.remove("selected");
  }
}

completeButton.addEventListener("click", () => {
  list.forEach((item) => {
    console.log(item);
    item.checked = true;
  });
  console.log("jioi");
  renderList();
});
clearButton.addEventListener("click", () => {
  list.forEach((item) => {
    if (item.checked) {
      list = list.filter((elem) => elem !== item);
    }
  });
  console.log("jioi");
  renderList();
});

enterButton.style.display = "none";
inputElement.addEventListener("keypress", () => {
  enterButton.style.display = "inline-block";
});

enterButton.addEventListener("click", () => {
  enterButton.style.display = "none";
  console.log(inputElement.value);
  list.indexOf(inputElement.value) == -1
    ? console.log("Not present")
    : console.log("Present");
  if (list.indexOf(inputElement.value) == -1) {
    list.push({ task: inputElement.value, checked: false });
    renderList();
  }

  inputElement.value = "";
  inputElement.focus();
});

function renderList(sort = "all") {
  tabSelect(sort);
  listElement.innerHTML = "";

  let len = 0;
  let temp = [];
  if (sort == "all") {
    temp = list;
  } else if (sort == "uncomplete") {
    temp = list.filter((item) => item.checked != true);
  } else if (sort == "complete") {
    temp = list.filter((item) => item.checked == true);
  }
  temp.forEach((item) => {
    const listItemContainer = document.createElement("div");
    listItemContainer.classList.add("listItemContainer");

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("check");
    checkBox.checked = item.checked;

    const listItem = document.createElement("div");
    listItem.classList.add("listItem");
    listItem.textContent = item.task;

    if (item.checked === true) {
      listItem.style.color = "green";
      listItem.style.textDecoration = "line-through";
    } else {
      len++;
      listItem.style.textDecoration = "none";
    }

    const delContainer = document.createElement("div");
    const delButton = document.createElement("button");
    delButton.textContent = "X";
    delButton.classList.add("del");
    delButton.style.display = "none";
    delButton.addEventListener("click", () => {
      console.log("entered the delete event");

      list = list.filter((elem) => {
        return elem !== item;
      });

      renderList();
    });
    checkBox.addEventListener("click", (event) => {
      console.log("change");
      console.log(event);
      item.checked = event.target.checked;

      renderList();
    });

    listItemContainer.addEventListener("mouseover", () => {
      delButton.style.display = "block";
    });
    listItemContainer.addEventListener("mouseout", () => {
      delButton.style.display = "none";
    });
    listItemContainer.appendChild(checkBox);
    listItemContainer.appendChild(listItem);
    delContainer.appendChild(delButton);
    listItemContainer.appendChild(delContainer);
    listElement.appendChild(listItemContainer);
  });

  remainingTask.textContent = `${len} tasks left`;
}
