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

    // don't let user enter without login
    useEffect(() =>
    {
        const user =
            localStorage.getItem("user");

        if(!user)
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
        <>
            <h1>TaskHub</h1>

            <h2>
                Welcome {user?.user_name}
            </h2>

            <button onClick={() => navigate("/todos")}>
                Todos
            </button>

            <br /><br />

            <button onClick={() => navigate("/posts")}>
                Posts
            </button>

            <br /><br />

            <button onClick={() => navigate("/profile")}>
                Info
            </button>

            <br /><br />

            <button onClick={logout}>
                Logout
            </button>
        </>
    );
}

export default HomePage;