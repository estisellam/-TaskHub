const authService =
    require("../services/authService");

async function login(req, res)
{
    try
    {
        const token =
            await authService.login(
                req.body.email,
                req.body.password
            );

        res.json({
            token
        });
    }
    catch(error)
    {
        res.status(401).json({
            message: error.message
        });
    }
}

module.exports = {
    login
};