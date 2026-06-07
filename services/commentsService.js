// load all functions that work with comments table
const funcCommentRepository = require("../repositories/commentsRepository");

// load all functions that work with users table
const funcUsersRepository = require("../repositories/usersRepository");

// load all functions that work with posts table
const funcPostsRepository = require("../repositories/postsRepository");

async function getAllComments()
{
    return await funcCommentRepository.getAllComments();
}

async function getCommentById(id)
{
    return await funcCommentRepository.getCommentById(id);
}

async function deleteComment(id)
{
    return await funcCommentRepository.deleteComment(id);
}

async function createComment(comment)
{
    // check if user exists
    const user = await funcUsersRepository.getUserById(comment.user_id);

    if(!user)
    {
        throw new Error("User not found 🥺");
    }

    // check if post exists
    const post = await funcPostsRepository.getPostById(comment.post_id);

    if(!post)
    {
        throw new Error("Post not found 🥺");
    }

    return await funcCommentRepository.createComment(comment);
}

async function updateComment(id, comment)
{
    return await funcCommentRepository.updateComment(id, comment);
}

module.exports = {getAllComments,getCommentById,deleteComment,createComment,updateComment};