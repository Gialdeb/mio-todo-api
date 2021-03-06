var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middlware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('TODO API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', middlware.requireAuthentication, function (req, res) {
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

});

// GET /todos/:id
app.get('/todos/:id', middlware.requireAuthentication, function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
    if(!!todo){
            res.json(todo.toJSON());
        }else{
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });

});

// POST /todos
app.post('/todos', middlware.requireAuthentication, function (req, res) {
    var body = _.pick(req.body, 'description', 'completed'); // Use _.pick description and completed

    db.todo.create(body).then(function (todo) {
       res.json(todo.toJSON())
    }, function (e) {
        res.status(400).json(e);
    });

});

    // DELETE /todos/:id

app.delete('/todos/:id', middlware.requireAuthentication, function(req, res) {
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
});

// PUT /todos/:id
app.put('/todos/:id', middlware.requireAuthentication, function (req, res) {
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

// POST /users/
app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password'); // Use _.pick email and password

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON())
    }, function (e) {
        res.status(400).json(e);
    });
});

// POST /user/login
app.post('/users/login', function (req, res) {
   var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication');

        if(token){
            res.header('Auth', token).json(user.toPublicJSON());
        } else{
            res.status(401).send();
        }
    }, function () {
        res.status(401).send();
    });
});

db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log('Express e partito sulla porta ' + PORT + '!' );
    });
});



