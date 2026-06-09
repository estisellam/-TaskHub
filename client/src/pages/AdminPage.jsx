import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // שליפת המשתמש המחובר מה-localStorage כדי לוודא שהוא אכן אדמין
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // אבטחת Frontend: אם המשתמש אינו אדמין, נעיף אותו חזרה לדף הבית
        if (!loggedInUser || !loggedInUser.is_admin) {
            navigate("/home");
            return;
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleBlock = async (userId, currentBlockStatus) => {
        setError("");
        setMessage("");
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/block`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isBlocked: !currentBlockStatus }) // הופך את הסטטוס הנוכחי
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Action failed");

            setMessage(data.message);
            fetchUsers(); // רענון הרשימה לאחר העדכון
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page">
            <div className="form-card" style={{ width: "80%", maxWidth: "900px" }}>
                <h2>Admin Dashboard 👑</h2>
                <p style={{ color: "#aaa", marginBottom: "20px" }}>Manage system users and access permissions</p>

                {error && <p style={{ color: "#ff4d4d", marginBottom: "10px" }}>{error}</p>}
                {message && <p style={{ color: "#00ffcc", marginBottom: "10px" }}>{message}</p>}

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", color: "white" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #555", textAlign: "left" }}>
                                <th style={{ padding: "12px" }}>ID</th>
                                <th style={{ padding: "12px" }}>Username</th>
                                <th style={{ padding: "12px" }}>Email</th>
                                <th style={{ padding: "12px" }}>Name</th>
                                <th style={{ padding: "12px" }}>Role</th>
                                <th style={{ padding: "12px" }}>Status</th>
                                <th style={{ padding: "12px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: "1px solid #333" }}>
                                    <td style={{ padding: "12px" }}>{u.id}</td>
                                    <td style={{ padding: "12px" }}>{u.user_name}</td>
                                    <td style={{ padding: "12px" }}>{u.email}</td>
                                    <td style={{ padding: "12px" }}>{u.first_name} {u.last_name}</td>
                                    <td style={{ padding: "12px" }}>
                                        {u.is_admin ? "⭐ Admin" : "User"}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        <span style={{ color: u.is_blocked ? "#ff4d4d" : "#00ffcc" }}>
                                            {u.is_blocked ? "Blocked 🔒" : "Active 🔓"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {/* מניעת חסימה עצמית של האדמין המחובר */}
                                        {u.id === loggedInUser.id ? (
                                            <span style={{ fontSize: "12px", color: "#888" }}>You</span>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleBlock(u.id, u.is_blocked)}
                                                style={{
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    background: u.is_blocked ? "#00ffcc" : "#ff4d4d",
                                                    color: u.is_blocked ? "#0d1238" : "white",
                                                    width: "auto",
                                                    marginTop: "0"
                                                }}
                                            >
                                                {u.is_blocked ? "Unblock" : "Block"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button onClick={() => navigate("/home")} style={{ marginTop: "20px", maxWidth: "200px" }}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default AdminPage;