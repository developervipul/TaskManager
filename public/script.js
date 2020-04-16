let submit = document.getElementById('submit')
let inputTask = document.getElementById('inputTask')
let dueDate = document.getElementById('dueDate')
let priority = document.getElementById('priority')
let desc = document.getElementById('desc')
let notes = document.getElementById('notes')
let tasklist = document.getElementById('tasklist')
let btn = document.querySelector('.btn');



const PriorityEnum = {
  "HIGH":0,
  "MEDIUM":1, 
  "LOW":2
}
Object.freeze(PriorityEnum)

submit.onclick = function() {  

    let todo = {
      title: inputTask.value,
      due_date: dueDate.value,
      priority: priority.value,
      desc: desc.value,
      notes: notes.value,
      status : 'INCOMPLETE'
  }

  if (inputTask.value != '') {
    addNewTodoJson(todo)
    loadTask()
    
  }


  inputTask.value = ''
  priority.selectedIndex = PriorityEnum.MEDIUM
  desc.value = ''
  notes.value = ''
  setTommorowDate()
  
    
}


async function getTodos() {
  const resp = await fetch('/todos', { method: 'GET' })
  const todos = await resp.json()
  return todos
}


async function addNewTodoJson(todo) {
  const resp = await fetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
}

function setNextDate(){

  var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    
    month = '' + month
    
    if(month.length === 1){
      month = '0' + month
    }
    let strDate = year + "-" + month + "-" + day
    dueDate.value = strDate
  
}

async function addNewTodoJson(todo) {
  const resp = await fetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })

  loadTask()
}



function addNewRow(t) {

  let id = document.createElement('td')
  id.textContent = t.id
  id.classList.add('hide')
  
  let expand = document.createElement('td')
  expand.textContent = 'Expand'
  expand.classList.add('expand')

  let title = document.createElement('td')
  title.textContent = t.title

  let inputDate = document.createElement("input");
  inputDate.type = "date"
  inputDate.value = t.due_date
  inputDate.readOnly = "true"
  let due_date = document.createElement('td')
  due_date.appendChild(inputDate)


  var select = document.createElement("SELECT");

  var opt1 = document.createElement('option');
   opt1.appendChild( document.createTextNode('HIGH') );
   opt1.value = 'HIGH';
 
   var opt2 = document.createElement('option');
   opt2.appendChild( document.createTextNode('MEDIUM') );
   opt2.value = 'MEDIUM'; 
 
   var opt3 = document.createElement('option');
   opt3.appendChild( document.createTextNode('LOW') );
   opt3.value = 'LOW';
   
   select.appendChild(opt1);
   select.appendChild(opt2);
   select.appendChild(opt3);
   
   select.selectedIndex = PriorityEnum[t.priority]

  let priority = document.createElement('td')
  priority.appendChild(select)


  let desc = document.createElement('td')
  desc.textContent = t.desc

  let checkBox = document.createElement("INPUT");
  checkBox.type = "checkbox"
  if(t.status == 'COMPLETE') {
    checkBox.checked = true
  }
  let status = document.createElement('td')
  status.appendChild(checkBox)

  let newRow = document.createElement('tr')
  let notesRow = document.createElement('tr')

  let notes = document.createElement('td')
  notes.colSpan = '2'
  let newNotes = document.createElement('td')
  newNotes.colSpan = '2'

  notes.textContent = t.notes
  
  let newNoteInput = document.createElement('input')
  newNoteInput.type = 'text'

  newNotes.appendChild(newNoteInput)

  let btnUpdate = document.createElement('button')
  btnUpdate.innerHTML = 'UPDATE'
  btnUpdate.classList.add('btn')

  let tdBtn = document.createElement('td')
  tdBtn.appendChild(btnUpdate)

  notesRow.appendChild(notes)
  notesRow.appendChild(newNotes)
  notesRow.appendChild(tdBtn)
  notesRow.classList.add('notesRow')


  newRow.appendChild(id)
  newRow.appendChild(title)
  newRow.appendChild(due_date)
  newRow.appendChild(priority)
  newRow.appendChild(desc)
  newRow.appendChild(status)
  newRow.appendChild(expand)
  newRow.classList.add('mainRow')

  tasklist.appendChild(newRow)
  tasklist.appendChild(notesRow)
  tasklist.classList.add('mainTable')

  btnUpdate.addEventListener('click', () => updateNotes(t.id,t.title, t.desc, t.note, newNoteInput.value, select.value,inputDate.value, checkBox.checked))

}


async function updateNotes(id,title, desc,oldNotes, newNotes, select, date, checkBox) {

  let newStatus = ''
  if (checkBox || checkBox == 'true'){
    newStatus = 'COMPLETE'
  } else {
    newStatus = 'INCOMPLETE'
  }

  const resp = await fetch('/todos/'+id+'/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      title: title,
      desc: desc,
      due_date: date,
      status: newStatus,
      priority : select,
      notes: oldNotes
    })
  })

}

function createTableHeader(){
  let id = document.createElement('td')
  id.textContent = 'ID'
  id.classList.add('hide')

  let expand = document.createElement('td')
  expand.textContent = 'Toggle'

  let title = document.createElement('td')
  title.textContent = 'Title'

  let due_date = document.createElement('td')
  due_date.textContent = 'Due Date'

  let priority = document.createElement('td')
  priority.textContent = 'Priority'

  let desc = document.createElement('td')
  desc.textContent = 'DESCRIPTION'

  let status = document.createElement('td')
  status.textContent = 'STATUS'

  let newRow = document.createElement('tr')

  newRow.appendChild(id)
  newRow.appendChild(title)
  newRow.appendChild(due_date)
  newRow.appendChild(priority)
  newRow.appendChild(desc)
  newRow.appendChild(status)
  newRow.appendChild(expand)
 

  tasklist.appendChild(newRow)
}
 

function loadTask(){

  tasklist.innerHTML = ''

  createTableHeader()

    getTodos().then(todos => {
        for( let todo of todos){
          addNewRow(todo)
        }
    })
    
    this.setNextDate()
}



window.addEventListener('load', loadTask())