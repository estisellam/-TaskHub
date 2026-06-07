const express = require("express");

const cors = require("cors");

const app = express();

const userRoutes = require("./routes/usersRoutes");

const todosRoutes =require("./routes/todosRoutes");

const postsRoutes =require("./routes/postsRoutes");

const commentsRoutes = require("./routes/commentsRoutes");

// allow requests from client
app.use(cors());
//convert from json to js
app.use(express.json());

app.use("/users", userRoutes);

app.use("/todos",todosRoutes);

app.use("/posts",postsRoutes);

app.use("/comments", commentsRoutes);

app.get("/", (req, res) => {
    res.json({message: "Hello To TaskHub"});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});