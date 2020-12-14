const express = require('express');
const app = express();
const { mongoose } = require('./db/mongoose');
// Load in the mongoose models
const { List, Task } = require('./db/models');
const bodyParser = require('body-parser');


/* MIDDLEWARE  */
// Load middleware
app.use(bodyParser.json());

//CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) =>{
    //console.log(req.params.listId);
    List.find({}).then((lists) => {
       res.send(lists);        
    });
})


/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    
    // We want to create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
    let title = req.body.title;

    let newList = new List({
        title,
        
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (incl. id)
        res.send(listDoc);
    })
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({message: 'Updated Succesfully'});
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', (req, res) => {
    
    // We want to delete the specified list (document with id in the URL)
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        //deleteTasksFromList(removedListDoc._id);
    })
});


/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    console.log(req.params.listId);
    Task.find({
        listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * GET /lists/:listId/tasks/:taskID
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Task.findOne({
        _id: req.params.taskId,
        listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});


/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 * http://localhost:3000/lists/5fc3f7b5e4e0ce9394085d4d/tasks
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // We want to create a new task in a list specified by listId

          let newTask = new Task({
                title: req.body.title,
                listId: req.params.listId

            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
    })

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 * http://localhost:3000/lists/5fc3f7b5e4e0ce9394085d4d/tasks/5fc3f877acc303780820db3c
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task (specified by taskId)

            Task.findOneAndUpdate({
                _id: req.params.taskId,
                listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({message: 'Updated Succesfully'});
            })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 * http://localhost:3000/lists/5fc3f7b5e4e0ce9394085d4d/tasks/5fc3f877acc303780820db3c
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {

     Task.findOneAndRemove({
                _id: req.params.taskId,
                listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
        });



app.listen(3000, () => {
    console.log("Server is listening on port 3000");    
})