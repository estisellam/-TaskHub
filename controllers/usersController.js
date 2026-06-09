// handle all users requests and return response to client
const usersService =require("../services/usersService");

async function getAllUsers(req, res)
{
    const users =await usersService.getAllUsers();

    res.json(users);
}

async function getUserById(req, res)
{
    const id = req.params.id;

    const user =await usersService.getUserById(id);

    if (!user)
    {
        return res.status(404).json({
            message: "User not found 🥺"
        });
    }

    res.json(user);
}

async function deleteUser(req, res)
{
    // delete user if he has permission
    if(req.user.id !== Number(req.params.id)&&!req.user.isAdmin)
    {
        return res.status(403).json({
            message: "Forbidden 🚫"
        });
    }
    const id = req.params.id;

    const result =await usersService.deleteUser(id);

    if (result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "User not found 🔎"
        });
    }

    res.json({
        message: "User deleted 🗑️"
    });
}

async function createUser(req, res)
{
    try
    {
        const userId =await usersService.createUser(req.body);

        res.status(201).json({
            userId
        });
    }
    catch(error)
    {
        res.status(400).json({
            message: error.message
        });
    }
}

async function updateUser(req, res)
{
    const result =await usersService.updateUser(req.params.id,req.body);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "User not found 🔎"
        });
    }

    res.json({
        message: "User updated 🏗️"
    });
}

async function login(req, res)
{
    try
    {
        const user = await usersService.login(req.body);

        if (user.is_blocked) {
            return res.status(403).json({
                message: "Your account has been blocked by the administrator! ⛔"
            });
        }

        res.json(user);
    }
    catch(error)
    {
        res.status(401).json({
            message: error.message
        });
    }
}

async function toggleBlockUser(req, res)
{
    try {
        const { id } = req.params;
        const { isBlocked } = req.body; // מקבל true או false מה-Frontend

        // קריאה ל-Service שיבצע את העדכון במסד הנתונים
        const result = await usersService.updateUserBlockStatus(id, isBlocked);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found 🔎" });
        }

        res.json({
            message: isBlocked ? "User blocked successfully 🔒" : "User unblocked successfully 🔓"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    createUser,
    updateUser,
    login,
    toggleBlockUser 
};