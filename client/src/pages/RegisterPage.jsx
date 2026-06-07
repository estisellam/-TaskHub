import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage()
{
    // move user between pages
    const navigate = useNavigate();

    // save all data from register form
    const [formData, setFormData] = useState({
        user_name: "",
        email: "",
        first_name: "",
        last_name: "",
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

    // send register request to server
    async function handleSubmit(event)
    {
        // stop page refresh
        event.preventDefault();

        try
        {
            const response = await fetch(
                "http://localhost:3000/users",
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
                // registration succeeded
                setMessage("user created successfully 😊");

                // move to login page after short delay
                setTimeout(() =>
                {
                    navigate("/login");
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
        <div className="page">
            <img
                src="/taskhub.png"
                alt="TaskHub"
                className="logo"
            />

            <div className="form-card">
                <h1>Register</h1>

                {message && (
                    <div className="message-box">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input type="text" name="user_name" placeholder="Username" required onChange={handleChange} />
                    <br />

                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                    <br />

                    <input type="text" name="first_name" placeholder="First Name" required onChange={handleChange} />
                    <br />

                    <input type="text" name="last_name" placeholder="Last Name" required onChange={handleChange} />
                    <br />

                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                    <br />

                    <button type="submit">Register</button>
                </form>

                <button type="button" onClick={() => navigate("/login")}>
                    Back To Login
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;