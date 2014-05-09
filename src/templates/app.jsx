/** @jsx React.DOM */
(function() {
  'use strict';

  var ENTER_KEY = 13

  var pouch = new PouchDB('todos');
  var remoteCouch = 'http://localhost:5984/todos';

  function sync() {
    var opts = {live: true};
    pouch.replicate.to(remoteCouch, opts);
    pouch.replicate.from(remoteCouch, opts);
  }

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
        todos.push(<li key={todo.title}>{todo.title}</li>);
      });
      return (<ul>{todos}</ul>);
    }
  });

  var TodoApp = React.createClass({

    getInitialState: function() {
      return { todos: [] };
    },

    componentDidMount: function() {
      var updateState = function(err,doc) {
        this.setState( {
          todos: _.map(doc.rows, function(row) { return row.doc; })
        });
      }

      pouch.info(function(err, info) {
        pouch.changes({
          since: info.update_seq,
          live: true
        }).on('change', function() {
          pouch.allDocs({ include_docs: true, descending: true}, updateState.bind(this));
        }.bind(this));
      }.bind(this));

      pouch.allDocs({ include_docs: true, descending: true}, updateState.bind(this));
    },

    newTodo: function(todo) {
      var newTodo = {
        title: todo
      }
      this.state.todos.push( newTodo );
      pouch.post(newTodo);
      this.setState({
        todos: this.state.todos
      });
    },

    render: function() {
      return (
        <div>
          <h1>My Todos</h1>
          <NewTodo newTodo={this.newTodo}/>
          <TodoList todos={this.state.todos}/>
        </div>
      );
    }
  });

  sync();

  React.renderComponent(
    <TodoApp/>,
    document.getElementById('content')
  );
})();
