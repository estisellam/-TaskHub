// handle all users requests and return response to client
const todosService =require("../services/todosService");

async function getAllTodos(req, res)
{
    const todos =await todosService.getAllTodos();
    res.json(todos);
}

async function getTodoById(req, res)
{
    const id = req.params.id;
    const todo =await todosService.getTodoById(id);
    if (!todo)
    {
        return res.status(404).json({
            message: "Todo not found 🥺"
        });
    }

    res.json(todo);
}

async function deleteTodo(req, res)
{
    const id = req.params.id;
    const result =await todosService.deleteTodo(id);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "Todo not found 🔎"
        });
    }

    res.json({
        message: "Todo deleted 🗑️"
    });
}

async function createTodo(req, res)
{
    try
    {
        const todoId =await todosService.createTodo(req.body);

        res.status(201).json({
            todoId
        });
    }
    catch(error)
    {
        res.status(400).json({
            message: error.message
        });
    }
}

async function updateTodo(req, res)
{
    const result =await todosService.updateTodo(req.params.id,req.body);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "Todo not found 🔎"
        });
    }

    res.json({
        message: "Todo updated 🏗️"
    });
}

module.exports = {getAllTodos,getTodoById,deleteTodo,createTodo,updateTodo};