const pool = require("../db/mysql");

async function getAllUsers()
{
    const [rows] = await pool.query(`
        SELECT
            id,
            user_name,
            email,
            first_name,
            last_name,
            created_at,
            is_admin
        FROM users
    `);

    return rows;
}

async function getUserById(id)
{
    const [rows] = await pool.query(
        `
        SELECT
            id,
            user_name,
            email,
            first_name,
            last_name,
            created_at,
            is_admin
        FROM users
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
}

async function deleteUser(id)
{
    const [result] = await pool.query(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [id]
    );

    return result;
}

async function findByUsername(userName)
{
    const [rows] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE user_name = ?
        `,
        [userName]
    );

    return rows[0];
}

async function findByEmail(email)
{
    const [rows] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
}

async function createUser(user)
{
    const [result] = await pool.query(
        `
        INSERT INTO users
        (
            user_name,
            email,
            first_name,
            last_name
        )
        VALUES
        (
            ?, ?, ?, ?
        )
        `,
        [
            user.user_name,
            user.email,
            user.first_name,
            user.last_name
        ]
    );

    return result.insertId;
}

async function updateUser(id, user)
{
    const [result] = await pool.query(
        `
        UPDATE users
        SET
            user_name = ?,
            email = ?,
            first_name = ?,
            last_name = ?
        WHERE id = ?
        `,
        [
            user.user_name,
            user.email,
            user.first_name,
            user.last_name,
            id
        ]
    );

    return result;
}


module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    createUser,
    findByEmail,
    findByUsername
};