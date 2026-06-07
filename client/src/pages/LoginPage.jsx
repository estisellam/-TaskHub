import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage()
{
    // move user between pages
    const navigate = useNavigate();

    // save login data
    const [formData, setFormData] = useState({
        user_name: "",
        password: ""
    });

    // message shown to user
    const [message, setMessage] = useState("");

    // update form when user types
    function handleChange(event)
    {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    // send login request to server
    async function handleSubmit(event)
    {
        event.preventDefault();

        try
        {
            const response = await fetch(
                "http://localhost:3000/users/login",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if(response.ok)
            {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                setMessage("login successful 😊");

                setTimeout(() =>
                {
                    navigate("/home");
                }, 1500);
            }
            else
            {
                setMessage(data.message);
            }
        }
        catch(error)
        {
            setMessage(
                `something went wrong 🥺 ${error.message}`
            );
        }
    }

    return (
        <div className="page">

            <img
                src="/taskhub.png"
                alt="TaskHub"
                className="logo"
            />

            <div className="form-card">

                <h1>Login</h1>

                {message && (
                    <div className="message-box">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="user_name"
                        placeholder="Username"
                        required
                        onChange={handleChange}
                    />

                    <br />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                    />

                    <br />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p>
                    Don't have an account yet?
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>

            </div>

        </div>
    );
}

export default LoginPage;