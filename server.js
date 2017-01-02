var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNexId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('TODO API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    } else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }


    if(query.hasOwnProperty('q') && query.q.length >0){
        where.description = {
            $like: '%' + query.q +'%'
        };
    }
    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    }, function (e) {
       res.status(500).json(e);
    });

    /*var filtredTodos = todos;

    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filtredTodos = _.where(filtredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
        filtredTodos = _.where(filtredTodos, {completed: false})
    }

    if(queryParams.hasOwnProperty('q') && queryParams.q.length>0){
        filtredTodos = _.filter(filtredTodos, function (todo) {
           return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase())> -1;
        });
    }
   res.json(filtredTodos);*/
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
   // var matchedTodo = _.findWhere(todos, {id: todoId});

    db.todo.findById(todoId).then(function (todo) {
    if(!!todo){
            res.json(todo.toJSON());
        }else{
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });

    // var matchedTodo;

    // todos.forEach(function (todo) {
    //     if(todoId === todo.id){
    //         matchedTodo = todo;
    //     }
    // });

   /* if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }*/
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed'); // Use _.pick description and completed

    db.todo.create(body).then(function (todo) {
       res.json(todo.toJSON())
    }, function (e) {
        res.status(400).json(e);
    });
    // call create on db.todo
    // respond with 200 and todo
    // e resp.status(400).json(e)

   /* if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
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



    res.json(body);*/
});

    // DELETE /todos/:id

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            return res.status(404).json({
                error: 'Nessun todo con questo ID!'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });

    // db.todo.findById(todoId).then(function(todo){
    //     if (todo)
    //         return todo.destroy();
    //     else
    //         res.status(404).send('Unable to delete');
    // }).then(function(todo){
    //      res.json(todo);
    // }).catch(function(){
    //      res.status(500).send();
    // });

});



    // app.delete('/todos/:id', function (req, res) {
    //     var todoId = parseInt(req.params.id, 10);

        // db.todo.findById(todoId).then(function (todo) {
        //    if(todo){
        //        todo.destroy().then(function () {
        //            res.status(200).send();
        //        })
        //    } else {
        //        res.status(404).send();
        //    }
        // });


        // db.todo.destroy({
        //    where:{
        //        id: todoId
        //    }
        // }).then(function (rowsDeleted) {
        //     if(rowsDeleted === 0){
        //         res.status(404).json({
        //             error: "Nessun todo con questo ID!"
        //         });
        //     } else {
        //         res.status(204).send();
        //     }
        // }, function () {
        //    res.status(500).send();
        // });


        /*var matchedTodo = _.findWhere(todos, {
            id: todoId
        });

        if(!matchedTodo) {
            res.status(404).json({"error": "nessun ID trovato"});
        } else {
            todos = _.without(todos, matchedTodo);
            res.json(matchedTodo);
        }*/
    // });

    // PUT /todos/:id
    /*app.put('/todos/:id', function (res, req) {
        var todoId = parseInt(req.params.id, 10);
        var matchedTodo = _.findWhere(todos, {id: todoId});
        var body = _.pick(req.body, 'description', 'completed'); // Use _.pick description and completed
        var validAttributes = {};

        if(!matchedTodo){
            return res.status(400).send();
        }

        if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
            validAttributes.completed = body.completed;
        }else if (body.hasOwnProperty('completed')){
            // bad
            return res.status(400).send();
        }

        if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
            validAttributes.description = body.description;
        } else if(body.hasOwnProperty('description')){
            return res.status(404).send();
        }

        // HERE
        _.extend(matchedTodo, validAttributes); // javascript usa la referenza quindi fa riferimento a matchedTodo
        res.json(matchedTodo);

    });*/

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

   db.todo.findById(todoId).then(function (todo) {
       if (todo){
           todo.update(attributes).then(function (todo) {
               res.json(todo.toJSON());
           }, function (e) {
               res.status(400).json(e);
           });
       }else {
           res.status(404).send();
       }
   }, function () {
       res.status(500).send();
   });
});


db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('Express e partito sulla porta ' + PORT + '!' );
    });
});



