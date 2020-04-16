const {db, Todos} = require('./model/db')

async function write(todos){
    await db.sync({ alter: true } )

    await Todos.create(todos)
   
}

async function findByID(id) {
    await db.sync()
    let todo
    try {
         todo = await Todos.findByPk(id)
    } catch (e) {
        console.log('Exception caught: ', e)
    }
    return todo

}

async function read() {
    await db.sync()
    const todoList = await Todos.findAll()
    return todoList
}

async function updateNotes(id, notes) {
    await db.sync({alter : true})
    await Todos.update({notes: notes}, {
        where: { id : id}
    })
    
}

async function updateTodos(id, todo) {
    const todoInstance = await Todos.findByPk(id)

    if ( todoInstance === null) {
        console.log('Not Found')
    } else {
        console.log(todoInstance instanceof Todos)
    }
    todoInstance.title = todo.title
    todoInstance.desc = todo.desc
    todoInstance.due_date = todo.due_date
    todoInstance.status = todo.status
    todoInstance.priority = todo.priority
    todoInstance.notes = todo.notes

    await todoInstance.save()
}

module.exports = {
    findByID,
    write,
    read,
    updateNotes,
    updateTodos
}