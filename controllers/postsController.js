// handle all posts requests and return response to client
const postsService =require("../services/postsService");

async function getAllPosts(req, res)
{
    const posts =await postsService.getAllPosts();
    res.json(posts);
}

async function getPostById(req, res)
{
    const id = req.params.id;
    const post =await postsService.getPostById(id);

    if(!post)
    {
        return res.status(404).json({
            message: "Post not found 🥺"
        });
    }

    res.json(post);
}


async function deletePost(req, res) {
    try {
        const id = req.params.id;
        const { userId } = req.body; // המשתמש שמנסה למחוק

        // 1. קודם כל נשלוף את הפוסט כדי לראות למי הוא שייך
        const post = await postsService.getPostById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found 🔎" });
        }

        // 2. בדיקה: האם הפוסט שייך למשתמש הפעיל?
        if (post.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You are not authorized to delete this post! ⛔" });
        }

        // 3. אם הכל תקין - מוחקים
        await postsService.deletePost(id);
        res.json({ message: "Post deleted 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updatePost(req, res) {
    try {
        const id = req.params.id;
        const { userId, title, body } = req.body; // הנתונים המעודכנים ומי שמנסה לעדכן

        // 1. נשלוף את הפוסט הקיים
        const post = await postsService.getPostById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found 🔎" });
        }

        // 2. בדיקה: האם הפוסט שייך למשתמש הפעיל?
        if (post.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You are not authorized to update this post! ⛔" });
        }

        // 3. עדכון
        await postsService.updatePost(id, { title, body });
        res.json({ message: "Post updated 🏗️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createPost(req, res)
{
    try
    {
        const postId =await postsService.createPost(req.body);

        res.status(201).json({
            postId
        });
    }
    catch(error)
    {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {getAllPosts,getPostById,deletePost,createPost,updatePost};