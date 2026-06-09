const db = require("../db/mysql");

async function getAllPhotos() {
    const [rows] = await db.query(`
        SELECT photo_id, album_id, title, url, created_at 
        FROM photos
    `);
    return rows;
}

async function getPhotoById(id) {
    const [rows] = await db.query(`
        SELECT photo_id, album_id, title, url, created_at 
        FROM photos WHERE photo_id = ?
    `, [id]);
    return rows[0];
}

// 👑 שאילתה מיועלת - שליפת תמונות השייכות לאלבום ספציפי
async function getPhotosByAlbumId(albumId) {
    const [rows] = await db.query(`
        SELECT photo_id, album_id, title, url, created_at 
        FROM photos 
        WHERE album_id = ?
        ORDER BY photo_id ASC
    `, [albumId]);
    return rows;
}

async function createPhoto(photo) {
    const [result] = await db.query(`
        INSERT INTO photos (album_id, title, url) 
        VALUES (?, ?, ?)
    `, [photo.album_id, photo.title, photo.url]);
    return result.insertId;
}

async function updatePhoto(id, photo) {
    const [result] = await db.query(`
        UPDATE photos SET title = ?, url = ? 
        WHERE photo_id = ?
    `, [photo.title, photo.url, id]);
    return result;
}

async function deletePhoto(id) {
    const [result] = await db.query(`
        DELETE FROM photos WHERE photo_id = ?
    `, [id]);
    return result;
}

module.exports = { getAllPhotos, getPhotoById, getPhotosByAlbumId, createPhoto, updatePhoto, deletePhoto };