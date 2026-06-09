const funcPhotosRepository = require("../repositories/photosRepository");

async function getAllPhotos() {
    return await funcPhotosRepository.getAllPhotos();
}

async function getPhotoById(id) {
    return await funcPhotosRepository.getPhotoById(id);
}

async function getPhotosByAlbumId(albumId) {
    return await funcPhotosRepository.getPhotosByAlbumId(albumId);
}

async function createPhoto(photo) {
    try {
        return await funcPhotosRepository.createPhoto(photo);
    } catch (error) {
        // תפיסת שגיאת מפתח זר במידה וה-album_id לא קיים במערכת
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error("Cannot add photo: Album does not exist 🥺");
        }
        throw error;
    }
}

async function updatePhoto(id, photo) {
    return await funcPhotosRepository.updatePhoto(id, photo);
}

async function deletePhoto(id) {
    return await funcPhotosRepository.deletePhoto(id);
}

module.exports = { getAllPhotos, getPhotoById, getPhotosByAlbumId, createPhoto, updatePhoto, deletePhoto };