// load all functions that work with posts table
const funcPostRepository =require("../repositories/postsRepository");

// load all functions that work with users table
const funcUsersRepository =require("../repositories/usersRepository");

async function getAllPosts()
{
    return await funcPostRepository.getAllPosts();
}

async function getPostById(id)
{
    return await funcPostRepository.getPostById(id);
}

async function deletePost(id)
{
    return await funcPostRepository.deletePost(id);
}

async function createPost(post)
{
    // check if user exists
    const user =await funcUsersRepository.getUserById(post.user_id);

    if(!user)
    {
        throw new Error("User not found 🥺");
    }

    return await funcPostRepository.createPost(post);
}

async function updatePost(id, post)
{
    return await funcPostRepository.updatePost(id,post);
}

module.exports = {getAllPosts,getPostById,deletePost,createPost,updatePost};