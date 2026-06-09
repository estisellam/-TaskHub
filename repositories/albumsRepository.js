const db = require("../db/mysql");

async function getAllAlbums() {
    const [rows] = await db.query(`
        SELECT album_id, user_id, title, created_at 
        FROM albums
    `);
    return rows;
}

async function getAlbumById(id) {
    const [rows] = await db.query(`
        SELECT album_id, user_id, title, created_at 
        FROM albums WHERE album_id = ?
    `, [id]);
    return rows[0];
}

async function createAlbum(album) {
    const [result] = await db.query(`
        INSERT INTO albums (user_id, title) 
        VALUES (?, ?)
    `, [album.user_id, album.title]);
    return result.insertId;
}

async function updateAlbum(id, album) {
    const [result] = await db.query(`
        UPDATE albums SET title = ? 
        WHERE album_id = ?
    `, [album.title, id]);
    return result;
}

async function deleteAlbum(id) {
    const [result] = await db.query(`
        DELETE FROM albums WHERE album_id = ?
    `, [id]);
    return result;
}

module.exports = { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };