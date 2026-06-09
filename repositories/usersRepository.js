const db = require("../db/mysql");

// שליפת כל המשתמשים עבור עמוד ה-Admin
async function getAllUsers() {
    const [rows] = await db.query(`
        SELECT id, user_name, email, first_name, last_name, created_at, is_admin, is_blocked 
        FROM users
    `);
    return rows;
}

async function getUserById(id) {
    const [rows] = await db.query(`
        SELECT id, user_name, email, first_name, last_name, created_at, is_admin, is_blocked
        FROM users
        WHERE id = ?
    `, [id]);
    return rows[0];
}

async function getUserByUsername(userName) {
    const [rows] = await db.query(`
        SELECT id, user_name, email, first_name, last_name, is_admin, is_blocked
        FROM users
        WHERE user_name = ?
    `, [userName]);
    return rows[0];
}

async function deleteUser(id) {
    const [result] = await db.query(`
        DELETE FROM users WHERE id = ?
    `, [id]);
    return result;
}

async function findByUsername(userName) {
    const [rows] = await db.query(`
        SELECT id FROM users WHERE user_name = ?
    `, [userName]);
    return rows[0];
}

async function findByEmail(email) {
    const [rows] = await db.query(`
        SELECT id FROM users WHERE email = ?
    `, [email]);
    return rows[0];
}

async function createUser(user) {
    const [result] = await db.query(`
        INSERT INTO users (user_name, email, first_name, last_name)
        VALUES (?, ?, ?, ?)
    `, [user.user_name, user.email, user.first_name, user.last_name]);
    return result.insertId;
}

async function updateUser(id, user) {
    const [result] = await db.query(`
        UPDATE users
        SET user_name = ?, email = ?, first_name = ?, last_name = ?
        WHERE id = ?
    `, [user.user_name, user.email, user.first_name, user.last_name, id]);
    return result;
}

// פונקציית עדכון חסימה עבור המנהל
async function updateUserBlockStatus(id, isBlocked) {
    const [result] = await db.query(`
        UPDATE users 
        SET is_blocked = ? 
        WHERE id = ?
    `, [isBlocked, id]);
    return result;
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    deleteUser,
    createUser,
    findByEmail,
    findByUsername,
    updateUser,
    updateUserBlockStatus
};