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

async function deletePost(req, res)
{
    const id = req.params.id;
    const result =await postsService.deletePost(id);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "Post not found 🔎"
        });
    }

    res.json({
        message: "Post deleted 🗑️"
    });
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

async function updatePost(req, res)
{
    const result =await postsService.updatePost(req.params.id,req.body);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "Post not found 🔎"
        });
    }

    res.json({
        message: "Post updated 🏗️"
    });
}

module.exports = {getAllPosts,getPostById,deletePost,createPost,updatePost};