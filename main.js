// Local Storage
let moreTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskIdCounter = moreTasks.length ? Math.max(...moreTasks.map(task => task.id)) + 1 : 1;

// Función para añadir una nueva tarea
function addTask() {
  let taskDetails = document.getElementById("taskInput").value;

  if (taskDetails !== "") {
    let task = {
      id: taskIdCounter++,
      title: taskDetails,
      completed: false,
    };
    // Agregar nuevo elemento al final del array
    moreTasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(moreTasks));
    document.getElementById("taskInput").value = "";

    // Verificar la vista actual y actualizar la lista mostrada
    let allBtn = document.getElementById("allBtn");
    if (allBtn.classList.contains("selector")) {
      showTasks(false, moreTasks);
    } else {
      let activeTasks = moreTasks.filter(task => !task.completed);
      showTasks(false, activeTasks);
    }

    deleteAllVisibility();
  }
}

// Función para mostrar la lista de tareas
function showTasks(completed, showList) {
  let listTasks = document.getElementById("listTasks");
  listTasks.innerHTML = "";

  for (let i = 0; i < showList.length; i++) {
    // Creacion de elementos para listar las tareas
    let newTask = document.createElement("li");
    newTask.classList.add("liTasks", "d-flex", "justify-content-between", "align-items-center", "w-100");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `task-${showList[i].id}`;
    checkbox.classList.add("checkTask");
    checkbox.checked = showList[i].completed;
    checkbox.addEventListener("change", function () {
      completeTask(showList[i].id);
    });

    let div = document.createElement("div");
    div.append(checkbox, document.createTextNode(showList[i].title));

    // Condicion para el estilo de texto de las tareas completadas
    if (showList[i].completed) {
      div.style.textDecorationLine = "line-through";
      newTask.classList.add("completed");
    }

    newTask.appendChild(div);

    // Agregar el icono de borrado solo dentro de "Completed"
    if (completed === true) {
      let deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.addEventListener("click", function () {
        deleteTask(showList[i].id);
      });
      newTask.appendChild(deleteButton);
    }

    listTasks.appendChild(newTask);
  }

  deleteAllVisibility();
}
showTasks(false, moreTasks);

// Función para marcar una tarea como completada o incompleta
function completeTask(taskId) {
  let taskIndex = moreTasks.findIndex(task => task.id === taskId);
  moreTasks[taskIndex].completed = !moreTasks[taskIndex].completed;
  localStorage.setItem("tasks", JSON.stringify(moreTasks));

  let allBtn = document.getElementById("allBtn");
  let activeBtn = document.getElementById("activeBtn");
  let completedBtn = document.getElementById("completedBtn");

  if (completedBtn.classList.contains("selector")) {
    let completedTasks = moreTasks.filter(task => task.completed);
    showTasks(true, completedTasks);
  } else if (activeBtn.classList.contains("selector")) {
    let activeTasks = moreTasks.filter(task => !task.completed);
    showTasks(false, activeTasks);
  } else if (allBtn.classList.contains("selector")) {
    showTasks(false, moreTasks);
  }

  deleteAllVisibility();
}

// Función para seleccionar una opción
function selectOption(selectedBtn) {
  let allOptions = document.getElementById("options").getElementsByTagName("button");
  for (let i = 0; i < allOptions.length; i++) {
    allOptions[i].classList.remove("selector");
  }
  selectedBtn.classList.add("selector");
}

// Función para borrar una tarea
function deleteTask(taskId) {
  let taskIndex = moreTasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    moreTasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(moreTasks));

    let completedBtn = document.getElementById("completedBtn");
    if (completedBtn.classList.contains("selector")) {
      filterCompleted();
    } else {
      showTasks(false, moreTasks);
    }
  }
}

// Función para borrar todas las tareas completadas
function deleteAll() {
  moreTasks = moreTasks.filter(task => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(moreTasks));

  let completedBtn = document.getElementById("completedBtn");
  if (completedBtn.classList.contains("selector")) {
    showTasks(true, []);
  } else {
    showTasks(false, moreTasks);
  }

  deleteAllVisibility();
}

// Función para visibilidad del botón "delete all"
function deleteAllVisibility() {
  let deleteAllBtn = document.getElementById("deleteAllBtn");
  let completedBtn = document.getElementById("completedBtn");

  let completedTasks = moreTasks.filter(task => task.completed);
  if (completedBtn.classList.contains("selector") && completedTasks.length > 0) {
    deleteAllBtn.style.display = "block";
  } else {
    deleteAllBtn.style.display = "none";
  }
}

// Función para filtrar tareas completadas
function filterCompleted() {
  let completedTasks = moreTasks.filter(task => task.completed);
  showTasks(true, completedTasks);
}

// Función para filtrar tareas activas
function filterActive() {
  let activeTasks = moreTasks.filter(task => !task.completed);
  showTasks(false, activeTasks);
}

// Función para filtrar todas las tareas
function filterAll() {
  showTasks(false, moreTasks);
}

document.getElementById("allBtn").addEventListener("click", function() {
  document.getElementById("form").style.display = "block";
  filterAll();
  selectOption(this);
  deleteAllVisibility();
});

document.getElementById("activeBtn").addEventListener("click", function() {
  document.getElementById("form").style.display = "block";
  filterActive();
  selectOption(this);
  deleteAllVisibility();
});

document.getElementById("completedBtn").addEventListener("click", function() {
  document.getElementById("form").style.display = "none";
  filterCompleted();
  selectOption(this);
  deleteAllVisibility();
});

document.getElementById("deleteAllBtn").addEventListener("click", deleteAll);
