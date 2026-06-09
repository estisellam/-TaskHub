import { useNavigate } from "react-router-dom";

function Navbar()
{
    const navigate = useNavigate();

    function logout()
    {
        localStorage.clear();

        navigate("/login");
    }

    return (
        <>
            {/* כפתור ה-Home החדש שיוביל לדף הבית */}
            <button onClick={() => navigate("/home")}>
                Home 🏠
            </button>

            <button onClick={() => navigate("/todos")}>
                Todos
            </button>

            <button onClick={() => navigate("/posts")}>
                Posts
            </button>

            <button onClick={() => navigate("/profile")}>
                Info
            </button>

            <button onClick={logout}>
                Logout
            </button>
        </>
    );
}

export default Navbar;