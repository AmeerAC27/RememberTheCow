document.addEventListener('DOMContentLoaded', function () {
  const tasksList = document.getElementById('tasks-list');
  const newTaskInput = document.getElementById('new-task');
  const addToBottomBtn = document.getElementById('add-to-bottom-btn');
  const deleteTaskBtn = document.getElementById('delete-task-btn');

  // Function to add a new task to the bottom of the to-do list
  function addToBottom() {
    const taskText = newTaskInput.value.trim();
    if (!taskText) return;

    const newTaskItem = document.createElement('li');

    newTaskItem.textContent = encodeHTML(taskText); // HTML-encode the task text
    tasksList.appendChild(newTaskItem);

    newTaskInput.value = '';

    const items = document.querySelectorAll("#tasks-list li");
  for (let i of items) {
    i.draggable = true;
    
    i.ondragstart = e => {
      current = i;
      for (let it of items) {
        if (it != current) { it.classList.add("hint"); }
      }
    };
    
    i.ondragenter = e => {
      if (i != current) { i.classList.add("active"); }
    };

    i.ondragleave = () => i.classList.remove("active");

    i.ondragend = () => { for (let it of items) {
        it.classList.remove("hint");
        it.classList.remove("active");
    }};
 
    i.ondragover = e => e.preventDefault();
 

    i.ondrop = e => {
      e.preventDefault();
      if (i != current) {
        let currentpos = 0, droppedpos = 0;
        for (let it=0; it<items.length; it++) {
          if (current == items[it]) { currentpos = it; }
          if (i == items[it]) { droppedpos = it; }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);
        } else {
          i.parentNode.insertBefore(current, i);
        }
      }
    };
  }
    // Call the function to save the updated to-do list to the server
    saveTodoListToServer();
  }

  // Function to delete the top item from the to-do list
  function deleteTopTask() {
    const firstTask = tasksList.querySelector('li');
    if (firstTask) {
      tasksList.removeChild(firstTask);
    }

    // Call the function to save the updated to-do list to the server
    saveTodoListToServer();
  }

  // Event listeners for adding to bottom and deleting tasks
  addToBottomBtn.addEventListener('click', addToBottom);
  deleteTaskBtn.addEventListener('click', deleteTopTask);

  // Utility function to HTML-encode special characters
  function encodeHTML(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#39;')
               .replace(/\//g, '&#47;')
               .replace(/\\/g, '&#92;');
    // You can add more replacements for other special characters as needed
  }

  // Function to save the to-do list to the server
  function saveTodoListToServer() {
    const todoList = getTodoListFromDOM();
    fetch("/webservice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: todoList }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save to-do list to the server.");
        }
        console.log("To-do list saved to the server successfully!");
      })
      .catch((error) => {
        console.error("Error saving to-do list to the server:", error.message);
      });
  }

  // Function to get the current to-do list from the DOM
  function getTodoListFromDOM() {
    const listItems = document.querySelectorAll("#tasks-list li");
    const todoList = [];
    listItems.forEach((item) => {
      todoList.push(item.textContent);
    });
    return todoList;
  }

  // Fetch the to-do list from the server when the page first loads
  fetch("/webservice")
    .then((response) => response.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        // Populate the to-do list from the server data
        data.items.forEach((itemText) => {
          const newTaskItem = document.createElement('li');
          newTaskItem.textContent = encodeHTML(itemText); // HTML-encode the task text
          tasksList.appendChild(newTaskItem);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching to-do list from the server:", error.message);
    });

  // Function to handle drag and drop (your existing code for drag and drop functionality)
  function handleDrag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }

  function handleDrop(event) {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("text");
    const sourceElement = document.getElementById(sourceId);
    const targetElement = event.target.closest("li");

    if (targetElement && sourceElement !== targetElement) {
      const list = targetElement.parentNode;
      list.insertBefore(sourceElement, targetElement);
    }

    // Call the function to save the updated to-do list to the server
    saveTodoListToServer();
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  // Attach drag and drop event listeners to the list items
  const listItems = document.querySelectorAll("#tasks-list li");
  listItems.forEach((item) => {
    item.addEventListener("dragstart", handleDrag);
    item.addEventListener("drop", handleDrop);
    item.addEventListener("dragover", allowDrop);
  });
});