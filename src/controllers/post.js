import User from "../models/user.js";
import Post from "../models/posts.js";
import createHttpError from "http-errors";

const Create = async (req, res, next) => {
  const userId = req.userId;
  const { content } = req.body;
  try {
    if (!content) {
      return next(createHttpError(400, "Please provide the content"));
    }
    const post = new Post({ author: userId, content });
    await post.save();
    res.status(200).json({
      success: true,
      message: "created successfully",
      data: post,
    });
  } catch (err) {
    console.log("🚀 ~ Create ~ err:", err);
    return next(createHttpError(500, "Error while creating post."));
  }
};

const Postlist = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const userId = req.userId;

  try {
    let query = { author: userId };

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const lastPage = page >= totalPages;

    const posts = await Post.find(query)
      .populate("author", "-password")
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      data: posts,
      meta: {
        totalCount: total,
        page,
        pageSize,
        totalPages,
        lastPage,
      },
    });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while getting posts."));
  }
};

const getPostById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const data = await Post.findOne({ _id: id, author: userId });

    if (!data) {
      throw createHttpError(404, "Posts not found");
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching post by id:", error);
    next(createHttpError(500, "Error while fetching post by id"));
  }
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const deleted = await Post.findOneAndDelete({
      _id: id,
      author: userId,
    });

    if (!deleted) {
      throw createHttpError(404, "Post not found");
    }

    res.status(200).json({
      success: true,
      message: "deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting book by id:", error);
    next(createHttpError(500, "Error while deleting book by id"));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return next(createHttpError(400, "Please provide all required fields"));
    }

    const updatedData = { content };

    const updated = await Post.findByIdAndUpdate(
      { _id: id, author: userId },
      updatedData,
      {
        new: true,
      }
    );

    if (!updated) {
      return next(createHttpError(404, "Post not found"));
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    next(createHttpError(500, "Error while updating book"));
  }
};

export { Create, Postlist, getPostById, deleteById, update };
