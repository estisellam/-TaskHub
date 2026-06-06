const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const usersRepository =require("../repositories/usersRepository");

const passwordsRepository =require("../repositories/passwordsRepository");

async function login(
    email,
    password
)
{
    const user =
        await usersRepository.findByEmail(
            email
        );

    if(!user)
    {
        throw new Error(
            "Invalid email or password"
        );
    }

    const passwordData =
        await passwordsRepository.getPasswordHash(
            user.id
        );
    if(!passwordData)
    {
        throw new Error(
            "Invalid email or password"
        );
    }

    const isValid =
        await bcrypt.compare(
            password,
            passwordData.hash_password
        );

    if(!isValid)
    {
        throw new Error(
            "Invalid email or password"
        );
    }

    const token =
        jwt.sign(
            {
                id: user.id,
                isAdmin: user.is_admin
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

    return token;
}

module.exports = {
    login
};