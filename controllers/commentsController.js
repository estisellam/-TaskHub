// handle all comments requests and return response to client

const commentsService = require("../services/commentsService");

async function getAllComments(req, res)
{
    const comments = await commentsService.getAllComments();

    res.json(comments);
}

async function getCommentById(req, res)
{
    const id = req.params.id;

    const comment = await commentsService.getCommentById(id);

    if(!comment)
    {
        return res.status(404).json({
            message: "Comment not found 🥺"
        });
    }

    res.json(comment);
}

async function deleteComment(req, res)
{
    const id = req.params.id;

    const result = await commentsService.deleteComment(id);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "Comment not found 🔎"
        });
    }

    res.json({
        message: "Comment deleted 🗑️"
    });
}

async function createComment(req, res)
{
    try
    {
        const commentId = await commentsService.createComment(req.body);

        res.status(201).json({
            commentId
        });
    }
    catch(error)
    {
        res.status(400).json({
            message: error.message
        });
    }
}

async function updateComment(req, res)
{
    const result = await commentsService.updateComment(req.params.id, req.body);

    if(result.affectedRows === 0)
    {
        return res.status(404).json({
            message: "Comment not found 🔎"
        });
    }

    res.json({
        message: "Comment updated 🏗️"
    });
}

module.exports = {getAllComments,getCommentById,deleteComment,createComment,updateComment};