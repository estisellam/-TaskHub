const pool = require("../db/mysql");

async function createPassword(
    userId,
    passwordHash
)
{
    await pool.query(
        `
        INSERT INTO passwords
        (
            user_id,
            hash_password
        )
        VALUES
        (
            ?, ?
        )
        `,
        [
            userId,
            passwordHash
        ]
    );
}

async function getPasswordHash(userId)
{
    const [rows] = await pool.query(
        `
        SELECT hash_password
        FROM passwords
        WHERE user_id = ?
        `,
        [userId]
    );

    return rows[0];
}

module.exports = {
    createPassword,
    getPasswordHash
};