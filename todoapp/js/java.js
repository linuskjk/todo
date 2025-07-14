let lists = {};            
let currentListId = null;  
let pollingInterval = null;
let liveSyncEnabled = false;   
let liveSyncInterval = null;   
let isSaving = false;
let savePending = false;

window.onload = async () => {
  await loadListsFromServer();
  if (Object.keys(lists).length > 0) {
    switchList(Object.keys(lists)[0]);
  }
  setupPolling();
};

function setupPolling() {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(() => {
    if (currentListId && !liveSyncEnabled) fetchListFromServer(currentListId);
  }, 2000);
}


function toggleLiveSync() {
  liveSyncEnabled = document.getElementById("liveSyncToggle").checked;

  if (liveSyncEnabled) {

    if (liveSyncInterval) clearInterval(liveSyncInterval);
    liveSyncInterval = setInterval(async () => {
      if (!currentListId) return;
      const serverList = await fetchListFromServer(currentListId);
      if (!serverList) return;


      if (JSON.stringify(lists[currentListId].tasks) !== JSON.stringify(serverList.tasks)) {
        lists[currentListId].tasks = serverList.tasks;
        renderTasks();
      }
    }, 2000);
  } else {

    if (liveSyncInterval) {
      clearInterval(liveSyncInterval);
      liveSyncInterval = null;
    }
  }
}

async function loadListsFromServer() {
  try {
    const stored = localStorage.getItem("todoLists");
    if (stored) {
      lists = JSON.parse(stored);
      populateListSelector();
    }
  } catch (err) {
    console.error("Error loading lists:", err);
  }
}

async function fetchListFromServer(id) {
  try {
    const res = await fetch(`/todoapp/api/load.php?code=${id}`);
    if (!res.ok) throw new Error("List not found");
    const list = await res.json();
    if (id === currentListId) {
      lists[id] = list
      if (!isSaving) renderTasks();
    }
    return list;
  } catch {
    return null;
  }
}

async function saveListToServer(id) {
  if (isSaving) {
    savePending = true;
    return;
  }
  isSaving = true;
  try {
    await fetch(`/todoapp/api/save.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: id, data: lists[id] }),
    });
  } catch (err) {
    console.error("Error saving list:", err);
  } finally {
    isSaving = false;
    if (savePending) {
      savePending = false;
      saveListToServer(id);
    }
  }
}

function saveToStorage() {
  localStorage.setItem("todoLists", JSON.stringify(lists));
}

function generateCode() {
  return Math.random().toString(36).substr(2, 8);
}

async function createList() {
  const name = document.getElementById("newListName").value.trim();
  if (!name) return alert("Enter a name for your list.");
  const id = generateCode();
  lists[id] = { name, tasks: [] };
  populateListSelector();
  switchList(id);
  document.getElementById("newListName").value = "";
  saveToStorage();
  await saveListToServer(id);
}

function switchList(id) {
  if (!lists[id]) return alert("List not found.");
  currentListId = id;
  document.getElementById("currentListName").textContent = lists[id].name;
  document.getElementById("listSelector").value = id;
  renderTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text || !currentListId) return;
  lists[currentListId].tasks.push({ text, done: false });
  saveToStorage();
  saveListToServer(currentListId);
  renderTasks();
  input.value = "";
}

function toggleTask(index) {
  const task = lists[currentListId].tasks[index];
  task.done = !task.done;
  saveToStorage();
  saveListToServer(currentListId);
  renderTasks();
}

function deleteTask(index) {
  lists[currentListId].tasks.splice(index, 1);
  saveToStorage();
  saveListToServer(currentListId);
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = lists[currentListId].tasks;
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = task.done ? "done" : "";
    span.onclick = () => toggleTask(index);

    const del = document.createElement("button");
    del.textContent = "✕";
    del.className = "delete-btn";
    del.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    li.appendChild(span);
    li.appendChild(del);
    taskList.appendChild(li);
  });
}

function populateListSelector() {
  const selector = document.getElementById("listSelector");
  selector.innerHTML = "";

  for (const id in lists) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = lists[id].name;
    selector.appendChild(option);
  }
}

function shareCurrentList() {
  if (!currentListId) return;
  prompt("Share this code to share the list:", currentListId);
}

async function importList() {
  const code = document.getElementById("importCode").value.trim();
  if (!code) return;
  if (lists[code]) {
    switchList(code);
  } else {

    const list = await fetchListFromServer(code);
    if (list) {
      lists[code] = list;
      populateListSelector();
      switchList(code);
    } else {
      alert("No list found with this code.");
    }
  }
  document.getElementById("importCode").value = "";


  if (currentListId === code) {
    renderTasks();
  }
}

async function deleteList(id) {
  if (!id || !lists[id]) return alert("List not found.");
  if (!confirm(`Delete list "${lists[id].name}" permanently?`)) return;

  delete lists[id];
  if (currentListId === id) {
    currentListId = null;
    document.getElementById("listSelector").value = "";
    document.getElementById("currentListName").textContent = "No list selected";
    document.getElementById("taskList").innerHTML = "";
  }
  populateListSelector();
  saveToStorage();

  try {
    const res = await fetch(`/todoapp/api/delete.php?code=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Server delete failed");
  } catch (err) {
    alert("Error deleting list on Server.");
    console.error(err);
  }
}

function resetApp() {
  if (!confirm("This deletes all lists and tasks! Are you sure?")) return;
  localStorage.removeItem("todoLists");
  lists = {};
  currentListId = null;
  location.reload();
}

function deleteCurrentList() {
  if (!currentListId) return alert("No list selected.");

  if (!confirm("Are you shure about deleting the list?")) return;

  fetch(`/todoapp/api/delete.php?code=${currentListId}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Serverresponse error.");
      
      delete lists[currentListId];
      saveToStorage();
      currentListId = null;
      document.getElementById("listSelector").value = "";
      document.getElementById("currentListName").textContent = "No list selected";
      document.getElementById("taskList").innerHTML = "";
      populateListSelector();
    })
    .catch(err => {
      console.error("Error while deleting:", err);
      alert("Error trying to delete from Server.");
    });
}
