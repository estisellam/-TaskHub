const db = require("../db/mysql");

//operation on todos table in db
async function getAllTodos() {
    const [rows] = await db.query(`
        SELECT
            todo_id,
            user_id,
            is_done,
            description_todo,
            created_at
        FROM todos
    `);

    return rows;
}

async function getTodoById(id)
{
    const [rows] = await db.query(
        `
        SELECT
            todo_id,
            user_id,
            is_done,
            description_todo,
            created_at
        FROM todos
        WHERE todo_id = ?
        `,
        [id]
    );

    return rows[0];
}

async function deleteTodo(id)
{
    const [result] = await db.query(
        `
        DELETE FROM todos
        WHERE todo_id = ?
        `,
        [id]
    );

    return result;
}

async function createTodo(todo)
{
    const [result] = await db.query(
        `
        INSERT INTO todos
        (
            user_id,
            description_todo
        )
        VALUES
        (
            ?, ?
        )
        `,
        [
            todo.user_id,
            todo.description_todo
        ]
    );

    return result.insertId;
}

async function updateTodo(id, todo)
{
    const [result] = await db.query(
        `
        UPDATE todos
        SET
            is_done = ?,
            description_todo = ?
        WHERE todo_id = ?
        `,
        [
            todo.is_done,
            todo.description_todo,
            id
        ]
    );

    return result;
} 

module.exports = {getAllTodos,getTodoById,deleteTodo,createTodo,updateTodo};
