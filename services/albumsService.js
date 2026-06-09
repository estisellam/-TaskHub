
const funcAlbumsRepository = require("../repositories/albumsRepository");

async function getAllAlbums() {
    return await funcAlbumsRepository.getAllAlbums();
}

async function getAlbumById(id) {
    return await funcAlbumsRepository.getAlbumById(id);
}

async function createAlbum(album) {
    try {
        // ניגשים ישירות להוספה - מסד הנתונים יבדוק בעצמו את ה-Foreign Key ביעילות מירבית!
        return await funcAlbumsRepository.createAlbum(album);
    } catch (error) {
        // אם השגיאה קשורה למפתח זר (המשתמש לא קיים)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error("Cannot create album: User does not exist 🥺");
        }
        throw error;
    }
}

async function updateAlbum(id, album) {
    return await funcAlbumsRepository.updateAlbum(id, album);
}

async function deleteAlbum(id) {
    return await funcAlbumsRepository.deleteAlbum(id);
}

module.exports = { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };