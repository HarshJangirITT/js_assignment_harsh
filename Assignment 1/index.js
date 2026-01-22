let tasks=[];
let completed=[];
let pending=[];
let searchlist=[];

document.querySelector('input').addEventListener('keypress',function(e){
    if( e.key=="Enter"){
        addTask();
    }
})

const debounce=(func,delay)=>{
    let timeoutId;
    return function(...args){
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId=setTimeout(()=>{
            func(...args);
        },delay);
    }
}

const addTask=()=>{
    const task=document.querySelector('input');
    if( task.value===""){
        return;
    }
    const newTask={
        id:Date.now(),
        text:task.value,
        completed:false
    }
    tasks.push(newTask);
    task.value="";
    completed=tasks.filter(t=>t.completed);
    pending=tasks.filter(t=>!t.completed);
    saveTasks();
    updateFilter();
}
const updateFilter=()=>{
    completed=tasks.filter(t=>t.completed);
    pending=tasks.filter(t=>!t.completed);
    const filterselect=document.querySelector('#filter');
    const filter=filterselect.value;
    if(filter==="all"){
        showTasks(tasks);
    }
    else if(filter==="completed"){
        showTasks(completed);
    }
    else{
        showTasks(pending);
    }
}
const removeTask=(id)=>{
    tasks=tasks.filter(t=>t.id!==id);
    saveTasks();
    updateFilter();
}

const removeCompleted=()=>{
    tasks=tasks.filter(t=>!t.completed);
    saveTasks();
    updateFilter();
}

const clearTasks=()=>{
    tasks=[];
    completed=[]
    pending=[]
    saveTasks();
    updateFilter();
}

const editTask=(id)=>{
    const newText=prompt("Edit your task:",tasks.find(t=>t.id===id).text);
    if(newText){
        tasks.find(t=>t.id===id).text=newText;
        saveTasks();
        updateFilter();
    }
}
const toggleTask=(id)=>{
    const task=tasks.find(t=>t.id===id);
    task.completed=!task.completed;
    saveTasks();
    updateFilter();
}

const showTasks = (list) => {
  let data = "";
  for (let i = 0; i < list.length; i++) {
    data += `
      <li class="task-item">
        <span class="task-text" style="background-color: ${list[i].completed ? 'green' : 'red'}">${list[i].text}</span>
        <div class="task-status">
          <input type="checkbox" ${
            list[i].completed ? "checked" : ""
          } onclick="toggleTask(${list[i].id})">
        </div>
        <div class="task-buttons">
          <button onclick="editTask(${list[i].id})">✏️</button>
          <button onclick="removeTask(${list[i].id})">❌</button>
        </div>
      </li>`;
  }
  document.getElementById("list").innerHTML = data;
}

const searchTasks=()=>{
    const query=document.getElementById("search").value.toLowerCase();
    searchlist=tasks.filter(t=>t.text.toLowerCase().includes(query));
    if(searchlist.length===0){
        alert("NO MATCH FOUND");
        document.getElementById("search").value="";
    }
    else{
    showTasks(searchlist);
    }
}

document.getElementById("search").addEventListener("input",debounce(searchTasks,300));



const saveTasks=()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
const loadTasks=()=>{
    const savedTasks=localStorage.getItem("tasks");
    if(savedTasks){
        tasks=JSON.parse(savedTasks);
        updateFilter();
    }
}

loadTasks();
updateFilter();
document.getElementById("filter").addEventListener("change",updateFilter);
