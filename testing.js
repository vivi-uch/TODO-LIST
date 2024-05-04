const input = document.getElementById('input');
const addBtn = document.getElementById('add-btn');
const todoHtml = document.getElementById('todos');
const img = document.getElementById('blank-img');
const delete_All = document.querySelector(".delete-all");
let completeNum = document.getElementById("complete-num");
let pendingNum = document.getElementById("pending-num");
let completed = document.getElementById("completed");
let pending = document.getElementById("pending");
var theme = document.getElementById("icon");

let todoJson = JSON.parse(localStorage.getItem("todos")) || [];
//BUG: completedNum and pendingNum is not updating
// Name section
function askForName() {
    let userName = prompt("Please enter your name:");
    if (userName) {
        localStorage.setItem("userName", userName);
        displayUserName(userName);
    }
}

function displayUserName(userName) {
    let nameElement = document.getElementById("name");
    if (nameElement) {
        nameElement.textContent = `Welcome, ${userName}!`;
    }
}

function checkUserName() {
    let userName = localStorage.getItem("userName");
    if (!userName) {
        askForName();
    } else {
        displayUserName(userName);
    }
}
//when refreshed this is activated, so that askForName won't be repeated
window.addEventListener("DOMContentLoaded", () => {
    checkUserName();
    showTodos();
});

function showTodos(){
    if(todoJson.length == 0){
        todoHtml.innerHTML = '';
        show();
    }
    else{
        // todoHtml.innerHTML = todoJson.map(gettodoHtml).join('');
        // //join converts it to string, map implies the function gettodoHtml on the todoJson array.
        // hide();

        let completedTodos = todoJson.filter(todo => todo.status === "completed");
        let pendingTodos = todoJson.filter(todo => todo.status === "pending");

        
        completeNum.textContent = completedTodos.length;
        pendingNum.textContent = pendingTodos.length;

        todoHtml.innerHTML = todoJson.map(gettodoHtml).join('');
        hide();
    }
}
function hide(){
    if (img) {
        img.style.display = 'none';
    }
}
//to show blank image
function show(){
    if (img) {
        img.style.display = 'block';
    }
}
// Generate HTML for a todo item
function gettodoHtml(todo, index) {
    let checked = todo.status === "completed" ? "checked" : "";
    return `
        <li class="todo ${todo.status}">
            <label for="${index}">
                <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
                <span>${todo.name}</span>
            </label>
            <button class="delete-btn" data-index="${index}" onclick="remove(this)">
                <i class="fa-solid fa-trash" style="color: #B197FC;"></i>
            </button>
        </li>
    `;
}

function deleteAll() {
    let check = crosscheck();
    if(check){
        todoJson = [];
        localStorage.setItem("todos",JSON.stringify(todoJson));
        showTodos();

        //Now it is updating...
        pendingNum.textContent = 0;
        completeNum.textContent = 0;
        //can't use localstorage.clear() cos it also clears "Username"..
    }
}
function crosscheck(){
    let check = window.confirm("are you sure?");
    return check;
}

function remove(button) {
    let todoItem = button.closest('li');
    let check = crosscheck();
    if(check){
        if (todoItem) {
            let dataIndex = parseInt(button.dataset.index);
            todoJson.splice(dataIndex, 1);
            localStorage.setItem("todos", JSON.stringify(todoJson));
        }    
    }
   showTodos();
}

function updateStatus(checkbox) {
    // let todoItem = checkbox.closest('li');
    let index = parseInt(checkbox.id);
    let status = checkbox.checked ? "completed" : "pending";
    updateStorageStatus(index, status);
    showTodos();
}

function updateStorageStatus(index, status) {
    if (todoJson[index]) {
        todoJson[index].status = status;
        localStorage.setItem("todos", JSON.stringify(todoJson));
        showTodos(); 
    } else {
        console.error('Todo item not found in todoJson:', index);
    }
}

function showCompletedTodos() {
    let completedTodos = todoJson.filter(todo => todo.status === "completed");
    completeNum.textContent = completedTodos.length;
    todoHtml.innerHTML = completedTodos.map(gettodoHtml).join('');
}

function showPendingTodos() {
    let pendingTodos = todoJson.filter(todo => todo.status === "pending");
    todoHtml.innerHTML = pendingTodos.map(gettodoHtml).join('');
    pendingNum.textContent = pendingTodos.length;
}

// Event listeners for "Completed" and "Pending" buttons
// document.querySelector(".statushtml:first-child").addEventListener("click", () => {
//     showCompletedTodos();
// });

// document.querySelector(".statushtml:last-child").addEventListener("click", () => {
//     showPendingTodos();
// });

completed.addEventListener("click", ()=>{
    showCompletedTodos();
});

pending.addEventListener("click",()=>{
    showPendingTodos();
});

function addTodos(todo){
    input.value = "";  //clears the input text after a todo has been added.
    // todoJson.unshift({name:todo,status:"pending"}); adds it to the beginning of the array
    todoJson.push({name:todo,status:"pending"}); //adds to the end of the array
    localStorage.setItem("todos",JSON.stringify(todoJson));
    showTodos();
}

// Event listener for adding todos
input.addEventListener("keyup", e => {
    let todo = input.value.trim();
    if (e.key === "Enter" && todo) {
        addTodos(todo);
    }
});

addBtn.addEventListener("click", () => {
    let todo = input.value.trim();
    if (todo) {
        addTodos(todo);
    }
});

delete_All.addEventListener("click", () => {
    deleteAll();
});

// darkmode or lightmode
theme.onclick = function(){
    let check = document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")){
        icon.src = "/images/sun.png";
    }
    else{
        icon.src = "/images/moon.png";
    }
}