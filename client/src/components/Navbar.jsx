import { useNavigate } from "react-router-dom";

function Navbar()
{
    const navigate = useNavigate();
    
    // שליפת המשתמש הנוכחי מה-localStorage כדי לבדוק האם הוא אדמין
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isAdmin = loggedInUser && loggedInUser.is_admin;

    function logout()
    {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <>
            <button onClick={() => navigate("/todos")}>
                Todos
            </button>

            <button onClick={() => navigate("/posts")}>
                Posts
            </button>

            {/* 📸 כפתור אלבומים חדש שיוביל לעמוד האלבומים שלכן! */}
            <button onClick={() => navigate("/albums")}>
                Albums 📸
            </button>

            <button onClick={() => navigate("/profile")}>
                Info
            </button>

            {/* 👑 כפתור אדמין שיופיע רק למי שיש לו הרשאות מנהל! */}
            {isAdmin && (
                <button onClick={() => navigate("/admin")} style={{ border: "2px solid #00ffcc", color: "#00ffcc" }}>
                    Admin Dashboard 👑
                </button>
            )}

            <button onClick={logout}>
                Logout
            </button>
        </>
    );
}

export default Navbar;