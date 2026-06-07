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
    // check required fields
    if(
        !data.user_name ||
        !data.email ||
        !data.first_name ||
        !data.last_name ||
        !data.password
    )
    {
        throw new Error("All fields are required");
    }
    // password must contain at least 6 characters
    if(data.password.length < 6)
    {
        throw new Error(
            "Password must contain at least 6 characters"
        );
    }
    // basic email validation
    if(!data.email.includes("@"))
    {
        throw new Error("Invalid email");
    }
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
    if(
    !user.user_name ||
    !user.email ||
    !user.first_name ||
    !user.last_name
    )
    {
        throw new Error("All fields are required");
    }
    if(!user.email.includes("@"))
    {

        throw new Error("Invalid email");

    }
    return await funcUsersRepository.updateUser(id,user);
}

async function login(data)
{
    const user =
        await funcUsersRepository.getUserByUsername(
            data.user_name
        );

    if(!user)
    {
        throw new Error("Invalid username or password");
    }

    const passwordData =
        await funcPasswordsRepository.getPasswordHash(
            user.id
        );

    const isMatch =
        await bcrypt.compare(
            data.password,
            passwordData.hash_password
        );

    if(!isMatch)
    {
        throw new Error("Invalid username or password");
    }

    return user;
}

module.exports = {getAllUsers,getUserById,deleteUser,createUser,updateUser,login};