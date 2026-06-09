// ✅ השורה הזו נשארת בראש הקובץ!
const commentsService = require("../services/commentsService");

// מחזיר את כל התגובות, או מסנן לפי פוסט אם קיבל ?postId=...
async function getAllComments(req, res)
{
    const comments = await commentsService.getAllComments();
    
    // בדיקה: אם שלחו לנו postId ב-URL (למשל comments?postId=3), נסנן רק את התגובות של אותו פוסט
    if (req.query.postId) {
        const postId = parseInt(req.query.postId);
        const filteredComments = comments.filter(comment => comment.post_id === postId);
        return res.json(filteredComments);
    }

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

// מחיקה מאובטחת - בודק שהמשתמש מוחק רק את של עצמו
async function deleteComment(req, res)
{
    try {
        const id = req.params.id;
        const { userId } = req.body; 

        const comment = await commentsService.getCommentById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found 🔎" });
        }

        if (comment.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only delete your own comments! ⛔" });
        }

        await commentsService.deleteComment(id);
        res.json({ message: "Comment deleted 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createComment(req, res)
{
    try
    {
        const commentId = await commentsService.createComment(req.body);
        res.status(201).json({ commentId });
    }
    catch(error)
    {
        res.status(400).json({ message: error.message });
    }
}

// עדכון מאובטח - בודק שהמשתמש עורך רק את של עצמו
async function updateComment(req, res)
{
    try {
        const id = req.params.id;
        const { userId, body } = req.body; 

        const comment = await commentsService.getCommentById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found 🔎" });
        }

        if (comment.user_id !== Number(userId)) {
            return res.status(403).json({ message: "You can only edit your own comments! ⛔" });
        }

        await commentsService.updateComment(id, { body });
        res.json({ message: "Comment updated 🏗️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 🔽 הנה ה-EXPORTS של ה-Controller בתחתית הקובץ:
module.exports = {
    getAllComments,
    getCommentById,
    deleteComment,
    createComment,
    updateComment
};