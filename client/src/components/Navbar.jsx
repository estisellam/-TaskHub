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