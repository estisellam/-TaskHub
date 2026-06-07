const db = require("../db/mysql");

//operation on posts table in db
async function getAllPosts() {
    const [rows] = await db.query(`
        SELECT
            post_id,
            user_id,
            title,
            body,
            created_at
        FROM posts
    `);

    return rows;
}

async function getPostById(id)
{
    const [rows] = await db.query(
        `
         SELECT
            post_id,
            user_id,
            title,
            body,
            created_at
        FROM posts
        WHERE post_id = ?
        `,
        [id]
    );

    return rows[0];
}

async function deletePost(id)
{
    const [result] = await db.query(
        `
        DELETE FROM posts
        WHERE post_id = ?
        `,
        [id]
    );

    return result;
}

async function createPost(post)
{
    const [result] = await db.query(
        `
        INSERT INTO posts
        (
            user_id,
            title,
            body
        )
        VALUES
        (
            ?, ?,?
        )
        `,
        [
            post.user_id,
            post.title,
            post.body
        ]
    );

    return result.insertId;
}

async function updatePost(id, post)
{
    const [result] = await db.query(
        `
        UPDATE posts
        SET
            title = ?,
            body = ?
        WHERE post_id = ?
        `,
        [
            post.title,
            post.body,
            id
        ]
    );

    return result;
} 

module.exports = {getAllPosts,getPostById,deletePost,createPost,updatePost};