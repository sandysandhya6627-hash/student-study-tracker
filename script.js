const taskForm=document.getElementById("taskForm");
const taskInput=document.getElementById("taskInput");
const subjectInput=document.getElementById("subjectInput");
const dateInput=document.getElementById("dateInput");
const priorityInput=document.getElementById("priorityInput");
const filterSelect=document.getElementById("filterSelect");
const taskList=document.getElementById("taskList");
const emptyMessage=document.getElementById("emptyMessage");
const clearAllBtn=document.getElementById("clearAllBtn");
const totalTasks=document.getElementById("totalTasks");
const completedTasks=document.getElementById("completedTasks");
const pendingTasks=document.getElementById("pendingTasks");
const progressPercent=document.getElementById("progressPercent");
let tasks=JSON.parse(localStorage.getItem("studyTasks"))||[];

function saveTasks(){localStorage.setItem("studyTasks",JSON.stringify(tasks))}
function updateStats(){
 const completed=tasks.filter(t=>t.completed).length;
 totalTasks.textContent=tasks.length;
 completedTasks.textContent=completed;
 pendingTasks.textContent=tasks.length-completed;
 progressPercent.textContent=tasks.length?Math.round(completed/tasks.length*100)+"%":"0%";
}
function formatDate(date){return date?new Date(date+"T00:00:00").toLocaleDateString():"No deadline"}
function escapeHtml(text){const div=document.createElement("div");div.textContent=text;return div.innerHTML}
function renderTasks(){
 const filter=filterSelect.value;
 const filtered=tasks.filter(t=>filter==="pending"?!t.completed:filter==="completed"?t.completed:true);
 taskList.innerHTML="";
 emptyMessage.style.display=filtered.length?"none":"block";
 filtered.forEach(task=>{
  const el=document.createElement("div");
  el.className="task "+(task.completed?"completed":"");
  el.innerHTML=`<input class="task-check" type="checkbox" ${task.completed?"checked":""} aria-label="Mark task as completed" onchange="toggleTask(${task.id})">
  <div><div class="task-name">${escapeHtml(task.name)}</div><div class="task-meta">${escapeHtml(task.subject)} • Due: ${formatDate(task.date)} <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span></div></div>
  <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>`;
  taskList.appendChild(el);
 });
 updateStats();
}
taskForm.addEventListener("submit",e=>{
 e.preventDefault();
 const newTask={id:Date.now(),name:taskInput.value.trim(),subject:subjectInput.value.trim(),date:dateInput.value,priority:priorityInput.value,completed:false};
 if(!newTask.name||!newTask.subject)return;
 tasks.unshift(newTask);saveTasks();renderTasks();taskForm.reset();priorityInput.value="Medium";taskInput.focus();
});
function toggleTask(id){tasks=tasks.map(t=>t.id===id?{...t,completed:!t.completed}:t);saveTasks();renderTasks()}
function deleteTask(id){tasks=tasks.filter(t=>t.id!==id);saveTasks();renderTasks()}
clearAllBtn.addEventListener("click",()=>{if(!tasks.length)return;if(confirm("Delete all study tasks?")){tasks=[];saveTasks();renderTasks()}});
filterSelect.addEventListener("change",renderTasks);
renderTasks();