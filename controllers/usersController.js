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

module.exports = {getAllUsers,getUserById,deleteUser,createUser,updateUser};