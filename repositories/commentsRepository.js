const db = require("../db/mysql");

// operation on comments table in db

async function getAllComments()
{
    const [rows] = await db.query(`
        SELECT
            comment_id,
            post_id,
            user_id,
            body,
            created_at
        FROM comments
    `);
    return rows;
}

async function getCommentById(id)
{
    const [rows] = await db.query(`
        SELECT
            comment_id,
            post_id,
            user_id,
            body,
            created_at
        FROM comments
        WHERE comment_id = ?
    `, [id]);
    return rows[0];
}

// 👑 הפונקציה החדשה שפרופ' קיפניס ביקש - שליפת תגובות לפי פוסט ספציפי
async function getCommentsByPostId(postId) {
    const [rows] = await db.query(`
        SELECT comment_id, post_id, user_id, body, created_at
        FROM comments
        WHERE post_id = ?
        ORDER BY comment_id ASC
    `, [postId]);
    return rows;
}

async function deleteComment(id)
{
    const [result] = await db.query(`
        DELETE FROM comments
        WHERE comment_id = ?
    `, [id]);
    return result;
}

async function createComment(comment)
{
    const [result] = await db.query(`
        INSERT INTO comments (post_id, user_id, body)
        VALUES (?, ?, ?)
    `, [comment.post_id, comment.user_id, comment.body]);
    return result.insertId;
}

async function updateComment(id, comment)
{
    const [result] = await db.query(`
        UPDATE comments
        SET body = ?
        WHERE comment_id = ?
    `, [comment.body, id]);
    return result;
}

// 🔽 הנה ה-EXPORTS של ה-Repository בתחתית הקובץ:
module.exports = {
    getAllComments,
    getCommentById,
    getCommentsByPostId, // <-- הוספנו כאן
    deleteComment,
    createComment,
    updateComment
};