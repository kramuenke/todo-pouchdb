/** @jsx React.DOM */
(function() {
  'use strict';

  var ENTER_KEY = 13

  var pouch = new PouchDB('todos');

  var NewTodo = React.createClass({
    newTodoCreated: function(event) {
      if(event.which !== ENTER_KEY) {
        return;
      }
      var val = this.refs.todoInput.getDOMNode().value.trim();
      if(val) {
        this.props.newTodo(val);
        this.refs.todoInput.getDOMNode().value = '';
      }
    },
    render: function() {
      return (
        <input ref="todoInput" onKeyDown={this.newTodoCreated} type="text" placeholder="add a new todo..."/>
      )
    }
  });

  var TodoList = React.createClass({
    render: function() {
      var todos = [];
      this.props.todos.forEach(function(todo) {
        todos.push(<li>{todo.title}</li>);
      });
      return (<ul>{todos}</ul>);
    }
  });

  var TodoApp = React.createClass({
    getInitialState: function() {
      return { todos: [] };
    },

    newTodo: function(todo) {
      this.state.todos.push( {
        title: todo}
      );
      this.setState({
        todos: this.state.todos
      });
    },

    render: function() {
      return (
        <div>
          <h1>Your Todos</h1>
          <NewTodo newTodo={this.newTodo}/>
          <TodoList todos={this.state.todos}/>
        </div>
      );
    }
  });

  React.renderComponent(
    <TodoApp/>,
    document.getElementById('content')
  );
})();
