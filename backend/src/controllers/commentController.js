const commentService = require(
  "../services/commentService"
);

const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment =
      await commentService.createComment(
        req.params.taskId,
        req.user.id,
        content
      );

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getTaskComments = async (
  req,
  res
) => {
  try {
    const comments =
      await commentService.getTaskComments(
        req.params.taskId,
        req.user.id
      );

    return res.status(200).json(
      comments
    );
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const updateComment = async (
  req,
  res
) => {
  try {
    const { content } = req.body;

    await commentService.updateComment(
      req.params.id,
      req.user.id,
      content
    );

    return res.status(200).json({
      message: "Comment updated successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const deleteComment = async (
  req,
  res
) => {
  try {
    await commentService.deleteComment(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
};