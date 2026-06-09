const photosService = require("../services/photosService");
const albumsService = require("../services/albumsService");

async function getAllPhotos(req, res) {
    try {
        const { albumId } = req.query; // תמיכה בסינון לפי URL: /photos?albumId=5
        let photos;

        if (albumId) {
            photos = await photosService.getPhotosByAlbumId(albumId);
        } else {
            photos = await photosService.getAllPhotos();
        }
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPhotoById(req, res) {
    try {
        const photo = await photosService.getPhotoById(req.params.id);
        if (!photo) return res.status(404).json({ message: "Photo not found 🔎" });
        res.json(photo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createPhoto(req, res) {
    try {
        const { album_id, userId } = req.body;

        // הגנה: בדיקה שהאלבום שייך למשתמש שמנסה להעלות אליו תמונה
        const album = await albumsService.getAlbumById(album_id);
        if (!album || album.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only add photos to your own albums! ⛔" });
        }

        const photoId = await photosService.createPhoto(req.body);
        res.status(201).json({ photoId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updatePhoto(req, res) {
    try {
        const id = req.params.id;
        const { userId, title, url } = req.body;

        const photo = await photosService.getPhotoById(id);
        if (!photo) return res.status(404).json({ message: "Photo not found 🔎" });

        // הגנה: בדיקה שהתמונה שייכת לאלבום של המשתמש הפעיל
        const album = await albumsService.getAlbumById(photo.album_id);
        if (album.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only edit photos in your own albums! ⛔" });
        }

        await photosService.updatePhoto(id, { title, url });
        res.json({ message: "Photo updated 🏗️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deletePhoto(req, res) {
    try {
        const id = req.params.id;
        const { userId } = req.body;

        const photo = await photosService.getPhotoById(id);
        if (!photo) return res.status(404).json({ message: "Photo not found 🔎" });

        // הגנה: בדיקה שהתמונה שייכת לאלבום של המשתמש הפעיל
        const album = await albumsService.getAlbumById(photo.album_id);
        if (album.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only delete photos from your own albums! ⛔" });
        }

        await photosService.deletePhoto(id);
        res.json({ message: "Photo deleted 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllPhotos, getPhotoById, createPhoto, updatePhoto, deletePhoto };