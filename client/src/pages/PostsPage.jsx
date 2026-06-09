import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || { id: 1, name: "Shira" }; 
    const currentUserId = loggedInUser.id;
    const currentUserName = loggedInUser.name || loggedInUser.username || "Me";

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:3000/posts");
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data = await response.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: currentUserId, title, body })
            });

            if (!response.ok) throw new Error("Failed to create post");
            fetchPosts();
            setTitle("");
            setBody("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (response.status === 403) return alert("⛔ You are not authorized to delete this post!");
            fetchPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdatePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId, title: editTitle, body: editBody })
            });
            if (response.status === 403) return alert("⛔ You are not authorized to edit this post!");
            setEditingPostId(null);
            fetchPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "40px 20px", maxWidth: "700px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>Community Posts 📋</h1>
                <button 
                    onClick={() => navigate('/home')} 
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                    Back to Home 🏠
                </button>
            </div>

            {error && <p style={{ color: "#ff4d4d" }}>{error}</p>}

            <form onSubmit={handleCreatePost} style={{ marginBottom: "30px", border: "1px solid rgba(255,255,255,0.2)", padding: "20px", borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.05)" }}>
                <h3 style={{ marginBottom: '15px' }}>Create New Post ✍️</h3>
                <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: '8px', border: 'none', color: '#333' }} />
                <textarea placeholder="What's on your mind?..." value={body} onChange={(e) => setBody(e.target.value)} style={{ width: "100%", padding: "12px", height: "100px", marginBottom: "10px", borderRadius: '8px', border: 'none', color: '#333' }} />
                <button type="submit" style={{ padding: "12px 24px", cursor: "pointer", borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #ff4db8, #ffb347)', color: 'white', fontWeight: '600' }}>Publish Post</button>
            </form>

            <div>
                {posts.map((post) => (
                    <div key={post.post_id} style={{ border: "none", padding: "20px", marginBottom: "20px", borderRadius: "16px", backgroundColor: "#fff", color: "#333", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
                        {editingPostId === post.post_id ? (
                            <div>
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: '6px', border: '1px solid #ccc' }} />
                                <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: '6px', border: '1px solid #ccc' }} />
                                <button onClick={() => handleUpdatePost(post.post_id)} style={{ padding: '6px 12px', background: '#27c5ff', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Save 💾</button>
                                <button onClick={() => setEditingPostId(null)} style={{ marginLeft: "5px", padding: '6px 12px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <h2 style={{ color: "#2c1466", marginBottom: '10px' }}>{post.title}</h2>
                                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '15px' }}>{post.body}</p>
                                <small style={{ color: "#777", display: 'block', marginBottom: '10px' }}>
                                    Posted by: <strong>{post.user_id === currentUserId ? currentUserName : `User #${post.user_id}`}</strong>
                                </small>
                                
                                <div style={{ marginBottom: "15px" }}>
                                    {post.user_id === currentUserId && (
                                        <>
                                            <button onClick={() => { setEditingPostId(post.post_id); setEditTitle(post.title); setEditBody(post.body); }} style={{ padding: '6px 14px', marginRight: "10px", cursor: "pointer", borderRadius: '6px', border: '1px solid #2c1466', background: 'none', color: '#2c1466', fontWeight: '600' }}>Edit 🏗️</button>
                                            <button onClick={() => handleDeletePost(post.post_id)} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "6px 14px", cursor: "pointer", borderRadius: "6px", fontWeight: '600' }}>Delete 🗑️</button>
                                        </>
                                    )}
                                </div>

                                <CommentsSection postId={post.post_id} currentUserId={currentUserId} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CommentsSection({ postId, currentUserId }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);
            if (!response.ok) return;
            const data = await response.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setComments([]);
        }
    };

    useEffect(() => {
        if (showComments) fetchComments();
    }, [showComments]);

    const handleAddComment = async (e) => {
        // מניעת רענון עמוד בלחיצה על אנטר או על כפתור השליחה
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch("http://localhost:3000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: postId, user_id: currentUserId, body: newComment })
            });
            
            if (response.ok) {
                setNewComment("");
                fetchComments(); // רענון רשימת התגובות מיד לאחר השליחה המצליחה
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (response.status === 403) return alert("⛔ You can only delete your own comments!");
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ marginTop: "10px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
            <button onClick={() => setShowComments(!showComments)} style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", padding: "5px 0", fontWeight: '600', fontSize: '14px' }}>
                {showComments ? "Hide Comments 🔼" : `Show Comments 💬 (${comments?.length || 0})`}
            </button>

            {showComments && (
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "12px", marginTop: "10px" }}>
                    {Array.isArray(comments) && comments.map(c => (
                        <div key={c.comment_id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee", color: '#333' }}>
                            <div style={{ fontSize: '14px' }}>
                                <strong>User #{c.user_id}:</strong> {c.body}
                            </div>
                            {c.user_id === currentUserId && (
                                <button onClick={() => handleDeleteComment(c.comment_id)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", fontSize: "12px", fontWeight: '600' }}>Delete ❌</button>
                            )}
                        </div>
                    ))}
                    {comments.length === 0 && <p style={{ color: '#777', fontSize: '13px', margin: '5px 0' }}>No comments yet. Be the first to comment!</p>}
                    <form onSubmit={handleAddComment} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <input type="text" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: '6px', border: '1px solid #ccc', color: '#333' }} />
                        <button type="submit" style={{ padding: "8px 16px", background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PostsPage;