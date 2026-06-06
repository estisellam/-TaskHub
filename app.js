const express = require("express");

const app = express();

const usersRoutes = require("./routes/usersRoutes");

const authenticate =require("./middleware/authMiddleware");

const authRoutes =require("./routes/authRoutes");

app.use(express.json());

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "TaskHub API"
    });
});



app.use(
    "/auth",
    authRoutes
);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});