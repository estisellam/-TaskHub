// load all functions that work with users table
const funcUsersRepository =require("../repositories/usersRepository");
// load all functions that work with password table
const funcPasswordsRepository =require("../repositories/passwordsRepository");
// save hashed password instead of the original password and than compare
const bcrypt = require("bcrypt");

async function getAllUsers()
{
    return await funcUsersRepository.getAllUsers();
}

async function getUserById(id)
{
    return await funcUsersRepository.getUserById(id);
}

async function deleteUser(id)
{
    return await funcUsersRepository.deleteUser(id);
}

async function createUser(data)
{
    const exUserName =await funcUsersRepository.findByUsername(data.user_name);

    if(exUserName)
    {
        throw new Error("Username already exists");
    }

    const exEmail =await funcUsersRepository.findByEmail(data.email);

    if(exEmail)
    {
        throw new Error("Email already exists");
    }

    //we saved just hash to protect info
    const passwordHash =await bcrypt.hash(data.password,10);

    const userId =await funcUsersRepository.createUser(data);

    await funcPasswordsRepository.createPassword(userId,passwordHash);

    return userId;
}

async function updateUser(id, user)
{
    return await funcUsersRepository.updateUser(id,user);
}

module.exports = {getAllUsers,getUserById,deleteUser,createUser,updateUser};