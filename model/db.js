const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/todos.db',
})

const Todos = db.define('todo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  desc: {
    type: Sequelize.STRING(40),
    defaultValue: 'DESCRIPTION',
  },
  due_date: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW
    
  },
  status: {
    type: Sequelize.STRING(12),
    allowNull: false,
    defaultValue: 'INCOMPLETE',
  },
  priority: {
    type: Sequelize.STRING(20)
    
  },
  notes: {
    type: Sequelize.STRING(255)
  }
})

module.exports = {
    db, Todos
}