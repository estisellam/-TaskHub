import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AlbumsPage() {
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // שליפת המשתמש המחובר מתוך ה-localStorage שחברה שלך הגדירה
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || { id: 1 }; 
    const currentUserId = loggedInUser.id;

    useEffect(() => {
        fetchAlbums();
    }, []);

    // 1. הבאת כל האלבומים מהשרת וסינון לפי המשתמש הנוכחי
    const fetchAlbums = async () => {
        try {
            const response = await fetch("http://localhost:3000/albums");
            if (!response.ok) throw new Error("Failed to fetch albums");
            const data = await response.json();
            
            // סינון מיועל בצד הלקוח להצגת אלבומים של המשתמש הפעיל בלבד
            const userAlbums = Array.isArray(data) ? data.filter(a => a.user_id === currentUserId) : [];
            setAlbums(userAlbums);
        } catch (err) {
            setError(err.message);
        }
    };

    // 2. יצירת אלבום חדש
    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        if (!newAlbumTitle.trim()) return;

        try {
            const response = await fetch("http://localhost:3000/albums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: currentUserId, title: newAlbumTitle })
            });

            if (!response.ok) throw new Error("Failed to create album");
            fetchAlbums();
            setNewAlbumTitle("");
        } catch (err) {
            setError(err.message);
        }
    };

    // 3. מחיקת אלבום מלא
    const handleDeleteAlbum = async (albumId) => {
        try {
            const response = await fetch(`http://localhost:3000/albums/${albumId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (response.status === 403) return alert("⛔ You are not authorized to delete this album!");
            fetchAlbums();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>My Photo Albums 📁</h1>
                <button 
                    onClick={() => navigate('/home')} 
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                    Back to Home 🏠
                </button>
            </div>

            {error && <p style={{ color: "#ff4d4d" }}>{error}</p>}

            {/* טופס הוספת אלבום חדש */}
            <form onSubmit={handleCreateAlbum} style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
                <input 
                    type="text" 
                    placeholder="Create a new album..." 
                    value={newAlbumTitle} 
                    onChange={(e) => setNewAlbumTitle(e.target.value)} 
                    style={{ flex: 1, padding: "12px", borderRadius: '12px', border: 'none', color: '#333', fontSize: '16px' }} 
                />
                <button type="submit" style={{ padding: "12px 24px", cursor: "pointer", borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #27c5ff, #ff4db8)', color: 'white', fontWeight: '600' }}>
                    Create Album
                </button>
            </form>

            {/* רשימת האלבומים */}
            <div>
                {albums.map((album) => (
                    <div key={album.album_id} style={{ border: "none", padding: "20px", marginBottom: "20px", borderRadius: "16px", backgroundColor: "#fff", color: "#333", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h2 style={{ color: "#2c1466", margin: 0 }}>{album.title}</h2>
                            <button 
                                onClick={() => handleDeleteAlbum(album.album_id)}
                                style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "6px", fontWeight: '600' }}
                            >
                                Delete Album 🗑️
                            </button>
                        </div>
                        
                        {/* רכיב התמונות הייעודי של האלבום הזה - ייפתח לפי דרישה */}
                        <PhotosSection albumId={album.album_id} currentUserId={currentUserId} />
                    </div>
                ))}
            </div>
            {albums.length === 0 && <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>No albums found. Create your first one above! 📸</p>}
        </div>
    );
}

// קומפוננטת משנה לניהול התמונות של כל אלבום בנפרד (מניעת שליפות מיותרות מהשרת)
function PhotosSection({ albumId, currentUserId }) {
    const [showPhotos, setShowPhotos] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [photoTitle, setPhotoTitle] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");

    const fetchPhotos = async () => {
        try {
            // קריאה לנתיב המיועל שיוצר שאילתת סינון ב-MySQL
            const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}`);
            if (!response.ok) return;
            const data = await response.json();
            setPhotos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching photos:", err);
            setPhotos([]);
        }
    };

    useEffect(() => {
        if (showPhotos) fetchPhotos();
    }, [showPhotos]);

    const handleAddPhoto = async (e) => {
        e.preventDefault();
        if (!photoTitle.trim() || !photoUrl.trim()) return;

        try {
            const response = await fetch("http://localhost:3000/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ album_id: albumId, userId: currentUserId, title: photoTitle, url: photoUrl })
            });
            
            if (response.ok) {
                setPhotoTitle("");
                setPhotoUrl("");
                fetchPhotos();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        try {
            const response = await fetch(`http://localhost:3000/photos/${photoId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (response.status === 403) return alert("⛔ You are not authorized to delete this photo!");
            fetchPhotos();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
            <button onClick={() => setShowPhotos(!showPhotos)} style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", padding: "5px 0", fontWeight: '600', fontSize: '15px' }}>
                {showPhotos ? "Hide Photos 🔼" : `Show Photos 📸 (${photos?.length || 0})`}
            </button>

            {showPhotos && (
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "12px", marginTop: "10px" }}>
                    
                    {/* גריד להצגת התמונות בצורה יפה */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                        {photos.map(p => (
                            <div key={p.photo_id} style={{ background: "#fff", padding: "8px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center", position: "relative" }}>
                                <img src={p.url} alt={p.title} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", marginBottom: "5px" }} 
                                     onError={(e) => { e.target.src = "https://placehold.co/150?text=No+Image"; }} // הגנה מפני לינקים שבורים
                                />
                                <div style={{ fontSize: "12px", fontWeight: "600", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: "#333" }}>{p.title}</div>
                                <button 
                                    onClick={() => handleDeletePhoto(p.photo_id)} 
                                    style={{ background: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", cursor: "pointer", marginTop: "5px" }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    {photos.length === 0 && <p style={{ color: '#777', fontSize: '13px' }}>No photos in this album yet.</p>}

                    {/* טופס הוספת תמונה בתוך האלבום */}
                    <form onSubmit={handleAddPhoto} style={{ borderTop: "1px dashed #ccc", paddingTop: "12px", marginTop: "10px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#2c1466" }}>Add New Photo:</h4>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <input type="text" placeholder="Photo Title" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} style={{ flex: 1, minWidth: "120px", padding: "6px", borderRadius: '6px', border: '1px solid #ccc' }} />
                            <input type="text" placeholder="Photo Image URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} style={{ flex: 2, minWidth: "180px", padding: "6px", borderRadius: '6px', border: '1px solid #ccc' }} />
                            <button type="submit" style={{ padding: "6px 14px", background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Upload</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AlbumsPage;