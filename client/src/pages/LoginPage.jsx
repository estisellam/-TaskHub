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
            // keep old fields and update only current one
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    // send login request to server
    async function handleSubmit(event)
    {
        // stop page refresh
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
                // save connected user
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                setMessage("login successful 😊");

                // move to todos page
                setTimeout(() =>
                {
                    navigate("/home");
                }, 1500);
            }
            else
            {
                // show error returned from server
                setMessage(data.message);
            }
        }
        catch(error)
        {
            // request failed
            setMessage(`something went wrong 🥺 ${error.message}`);
        }
    }

    return (
        <>
            <h1>Login</h1>

            <p>{message}</p>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="user_name"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    Login
                </button>

            </form>
            <p>
                dont have an account yet ?
            </p>

            <button
                type="button"
                onClick={() => navigate("/register")}
            >
                Register
            </button>
        </>
    );
}

export default LoginPage;