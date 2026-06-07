import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ProfilePage()
{
    // get logged in user
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // move between pages
    const navigate = useNavigate();

    // save updated user details
    const [formData, setFormData] = useState({
        user_name: user.user_name,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    });

    // message shown to user
    const [message, setMessage] = useState("");

    // update input when user types
    function handleChange(event)
    {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    // send updated user details to server
    async function handleSubmit(event)
    {
        event.preventDefault();

        try
        {
            const response = await fetch(
                `http://localhost:3000/users/${user.id}`,
                {
                    method: "PUT",
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
                // update local storage too
                const updatedUser = {
                    ...user,
                    ...formData
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

                setMessage(
                    "User updated successfully 😊"
                );
            }
            else
            {
                setMessage(data.message);
            }
        }
        catch(error)
        {
            setMessage(error.message);
        }
    }

    return (
        <>
            <h1>My Info 📝</h1>

            <p>{message}</p>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Update Details
                </button>

            </form>

            <br />

            <button onClick={() => navigate("/home")}>
                Home
            </button>
        </>
    );
}

export default ProfilePage;