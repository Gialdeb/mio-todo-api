/**
 * Created by Giuseppe on 02/01/2017.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
   'dialect' : 'sqlite',
    'storage' : __dirname + '/basic-squlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
   description :{
       type: Sequelize.STRING,
       allowNull: false,
       validate : {
           len:[1, 250]
       }
   } ,
    completed : {
       type : Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
        //force: true
}).then(function () {
    console.log('Tutto è sincronizzato');

    Todo.findById(3).then(function (todo) {
        if(todo){
            console.log(todo.toJSON());
        } else{
            console.log('Todo non trovato');
        }

    });

   /* Todo.create({
        description: 'take out trash',
        //completed: false
    }).then(function (todo) {
        //console.log("Finito!");
        //console.log(todo);
        return Todo.create({
            description: 'Clean office'
        });
    }).then(function () {
        //return Todo.findById(1)
        return Todo.findAll({
            where : {
                description : {
                    $like: '%Office%'
                }
            }
        });
    }).then(function (todos) {
        if(todos){
            todos.forEach(function (todo) {
                console.log(todo.toJSON());
            });
        } else {
            console.log('nessun todo trovato!!');
        }
    }).catch(function (e) {
        console.log(e);
    })*/
});