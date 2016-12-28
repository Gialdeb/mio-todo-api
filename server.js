var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
   description : 'Meet mon for lunch',
    completed : false
}, {
    id: 2,
    desciption: 'Go to the market',
    completed : false
},{
    id: 3,
    desciption: 'Feed the cat',
    completed : true
}];

app.get('/', function (req, res) {
    res.send('TODO API Root');
})

// GET /todos
app.get('/todos', function (req, res) {
   res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    todos.forEach(function (todo) {
        if(todoId === todo.id){
            matchedTodo = todo;
        }
    });

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }


    // Iterate of todos array
    //
    // res.status(404).send();

    // res.send('Asking for todo with id of ' + req.params.id);
})

app.listen(PORT, function () {
    console.log('Express e partito sulla porta ' + PORT + '!' );
})