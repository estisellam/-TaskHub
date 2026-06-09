const albumsService = require("../services/albumsService");

async function getAllAlbums(req, res) {
    try {
        const albums = await albumsService.getAllAlbums();
        res.json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAlbumById(req, res) {
    try {
        const album = await albumsService.getAlbumById(req.params.id);
        if (!album) return res.status(404).json({ message: "Album not found 🔎" });
        res.json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createAlbum(req, res) {
    try {
        const albumId = await albumsService.createAlbum(req.body);
        res.status(201).json({ albumId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateAlbum(req, res) {
    try {
        const id = req.params.id;
        const { userId, title } = req.body;

        const album = await albumsService.getAlbumById(id);
        if (!album) return res.status(404).json({ message: "Album not found 🔎" });

        if (album.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only edit your own albums! ⛔" });
        }

        await albumsService.updateAlbum(id, { title });
        res.json({ message: "Album updated 🏗️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteAlbum(req, res) {
    try {
        const id = req.params.id;
        const { userId } = req.body;

        const album = await albumsService.getAlbumById(id);
        if (!album) return res.status(404).json({ message: "Album not found 🔎" });

        if (album.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only delete your own albums! ⛔" });
        }

        await albumsService.deleteAlbum(id);
        res.json({ message: "Album deleted 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };