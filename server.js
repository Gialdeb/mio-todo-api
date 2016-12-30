var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNexId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('TODO API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
   res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    // var matchedTodo;

    // todos.forEach(function (todo) {
    //     if(todoId === todo.id){
    //         matchedTodo = todo;
    //     }
    // });

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed'); // Use _.pick description and completed

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(404).send();
    }

    body.description = body.description.trim();
    // Set bidy.description to be trimed value

    //  add id field
    body.id = todoNexId++;
    // todoNexId++;
    // push body into array
    todos.push(body);

    // console.log('description: ' + body.description);



    res.json(body);
});

    // DELETE /todos/:id
    app.delete('/todos/:id', function (req, res) {
        var todoId = parseInt(req.params.id, 10);
        var matchedTodo = _.findWhere(todos, {id: todoId});

        if(!matchedTodo) {
            res.status(404).json({"error": "nessun ID trovato"});
        } else {
            todos = _.without(todos, matchedTodo);
            res.json(matchedTodo);
        }
    });


app.listen(PORT, function () {
    console.log('Express e partito sulla porta ' + PORT + '!' );
});