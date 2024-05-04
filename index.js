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

//LOCALSTORAGE WORKING PERFECTLY
let todoJson = JSON.parse(localStorage.getItem("todos")) || [];
//typeof(todoJson) is pbject.
//todoJson would be an array of todoitems from the local storage but if empty return an empty array hence the logial OR..

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



// retrieves everything when browser is opened.
function gettodoHtml(todo, index){
    // <i class="fa-solid fa-circle-minus" style="color: #B197FC;"></i>
    //whatever the status of the is, would determine if the checkbox is to be checked or not.
    let checked = todo.status =="completed" ? "checked" : "";

    //index from 0,for distuiguishing them..
    return `
        <li class="todo">
            <label for="${index}">
                <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
                <span class="${checked}">${todo.name}</span>
            </label>
            <button class="delete-btn" data-index="${index}" onclick="remove(this)">
            <i class="fa-solid fa-trash" style="color: #B197FC;"></i>
            </button>
        </li>
    `;
}

//all delete type from delete all to delete..
function deleteAll() {
    const check = confirm("Are you sure ?");
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

function remove(button) {
    // Retrieve the parent <li> element containing the todo item
    let todoItem = button.closest('li');
    if (todoItem) {
        // Retrieve the index of the todo item from the data-index attribute of the delete button
        let dataIndex = button.dataset.index;
                    // or 
        // let dataIndex = button.getAttribute('data-index');
        let index = parseInt(dataIndex);

        // Remove from todoitem array
        todoJson.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todoJson));
    }
    showTodos();
}

// SEVENTH THING TO DO
// function updateStatus(todo){
//     let todoName = todo.parentElement.lastElementChild;
//     if(todo.checked){
//         todoName.classList.add("checked");
//         todoJson(todo.id).status = "completed";
//     }
//     else{
//         todoName.classList.remove("checked");
//     }
//     localStorage.setItem("todos", JSON.stringify(todoJson));
// }

//Checked ststus...
function updateStatus(checkbox) {
    let index = parseInt(checkbox.id);
    // if(checkbox.checked){
    //     status = "completed";
    // }
    // else{
    //     status = "pending";
    // }
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
        console.error('Todo item not found in todoJson: ', index);
    }
}



// THIRD THING TO DO
//determine what shows, img or todos, completed and pending.
function hide(){
    if (img) {
        img.style.display = 'none';
    }
}
function show(){
    if (img) {
        img.style.display = 'block';
    }
}
function showTodos(){
    if(todoJson.length == 0){
        todoHtml.innerHTML = '';
        show();
    }
    else{
        let completedTodos = todoJson.filter(todo => todo.status === "completed");
        let pendingTodos = todoJson.filter(todo => todo.status === "pending");
        
        completeNum.textContent = completedTodos.length;
        pendingNum.textContent = pendingTodos.length;

        todoHtml.innerHTML = todoJson.map(gettodoHtml).join('');
        //join converts it to string, map implies the function gettodoHtml on the todoJson array.
        hide();
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


// add todo
function addTodos(todo){
    input.value = "";  //clears the input text after a todo has been added.
    // adds it to the beginning of the array
    todoJson.unshift({name:todo,status:"pending"});
    
    //adds to the end of the array
    //todoJson.push({name:todo,status:"pending"}); 
    
    localStorage.setItem("todos",JSON.stringify(todoJson));
    showTodos();
}

// All event listeners
//enter key
input.addEventListener("keyup", e=>{ //  when enter key is pressed
    //assigning the trimmed(removing white spaces b4 and after) input of the user to the variable todo
    let todo = input.value.trim();
    if(!todo || e.key != "Enter"){
        return;
    }
    addTodos(todo);
});
// add button
addBtn.addEventListener("click", ()=>{
    let todo = input.value.trim();
    if(!todo){
        return;
    }
    addTodos(todo);
});
//delete bttn
delete_All.addEventListener("click",()=>{
    deleteAll();
});
//complete bttn
completed.addEventListener("click", ()=>{
    showCompletedTodos();
});
//pending bttn
pending.addEventListener("click",()=>{
    showPendingTodos();
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

// localStorage.clear();
// To clear all data from local storage