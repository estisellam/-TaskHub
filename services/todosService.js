// load all functions that work with todo table
const funcTodoRepository =require("../repositories/todosRepository");

// load all functions that work with users table
const funcUsersRepository =require("../repositories/usersRepository");

async function getAllTodos()
{
    return await funcTodoRepository.getAllTodos();
}

async function getTodoById(id)
{
    return await funcTodoRepository.getTodoById(id);
}

async function deleteTodo(id)
{
    return await funcTodoRepository.deleteTodo(id);
}

async function createTodo(todo)
{
    // check if user exists
    const user =await funcUsersRepository.getUserById(todo.user_id);

    if(!user)
    {
        throw new Error("User not found 🥺");
    }

    return await funcTodoRepository.createTodo(todo);
}

async function updateTodo(id, todo)
{
    return await funcTodoRepository.updateTodo(id,todo);
}

module.exports = {getAllTodos,getTodoById,deleteTodo,createTodo,updateTodo};