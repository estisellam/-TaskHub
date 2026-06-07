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

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>

                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default HomePage;