const usersRepository =require("../repositories/usersRepository");

const passwordsRepository =require("../repositories/passwordsRepository");

const bcrypt = require("bcrypt");

async function getAllUsers()
{
    return await usersRepository.getAllUsers();
}

async function getUserById(id)
{
    return await usersRepository.getUserById(id);
}

async function deleteUser(id)
{
    return await usersRepository.deleteUser(id);
}

async function createUser(data)
{
    const existingUsername =
        await usersRepository.findByUsername(
            data.user_name
        );

    if(existingUsername)
    {
        throw new Error(
            "Username already exists"
        );
    }

    const existingEmail =
        await usersRepository.findByEmail(
            data.email
        );

    if(existingEmail)
    {
        throw new Error(
            "Email already exists"
        );
    }

    const passwordHash =
        await bcrypt.hash(
            data.password,
            10
        );

    const userId =
        await usersRepository.createUser(
            data
        );

    await passwordsRepository.createPassword(
        userId,
        passwordHash
    );

    return userId;
}

async function updateUser(id, user)
{
    return await usersRepository.updateUser(
        id,
        user
    );
}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    createUser,
    updateUser
};