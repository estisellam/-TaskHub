import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function HomePage()
{
    // move between pages
    const navigate = useNavigate();

    // get current user from local storage
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // בדיקה האם המשתמש המחובר כרגע הוא אדמין במערכת
    const isAdmin = user && user.is_admin;

    // don't let user enter without login
    useEffect(() =>
    {
        const savedUser = localStorage.getItem("user");

        if(!savedUser)
        {
            navigate("/login");
        }
    }, []);

    function logout()
    {
        // remove saved user and return to login
        localStorage.clear();

        navigate("/login");
    }

    return (
        <div className="page">

            <div className="home-card">

                <img
                    src="/taskhub.png"
                    alt="TaskHub"
                    className="logo"
                />

                <h1>TaskHub</h1>

                <h2>
                    Welcome {user?.user_name} 👋
                </h2> 

                <div className="home-buttons">

                    <button
                        onClick={() => navigate("/todos")}
                    >
                        Todos
                    </button>

                    <button
                        onClick={() => navigate("/posts")}
                    >
                        Posts
                    </button>

                    {/* 📸 כפתור אלבומים חדש שמוביל לעמוד האלבומים שלכן! */}
                    <button
                        onClick={() => navigate("/albums")}
                    >
                        Albums 📸
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>
                    
                    {isAdmin === 1 && (
                        <button
                            onClick={() => navigate("/admin")}
                            style={{ border: "2px solid #00ffcc", color: "#00ffcc", fontWeight: "bold" }}
                        >
                            Admin Dashboard 👑
                        </button>
                    )}

                    {/* 🚪 כפתור יציאה מעוצב דינמית: אם הוא מנהל הוא רגיל, אם הוא משתמש רגיל הוא מתמרכז על כל השורה! */}
                    <button
                        onClick={logout}
                        style={
                            isAdmin !== 1 
                                ? { gridColumn: "span 2", width: "100%", justifySelf: "center" } 
                                : {}
                        }
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default HomePage;