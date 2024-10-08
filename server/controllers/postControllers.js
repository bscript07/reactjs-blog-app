const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const fs = require("fs");

const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      !req.files ||
      !req.files.thumbnail
    ) {
      return next(new HttpError("Missing required fields or file", 422));
    }

    const { thumbnail } = req.files;

    // Check the file size
    if (thumbnail.size > 2000000) {
      return next(new HttpError("Thumbnail file size exceeds 2MB", 422));
    }

    const fileExtension = path.extname(thumbnail.name);
    const newFileName = `${uuid()}${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Log the path to verify
    const filePath = path.join(uploadsDir, newFileName);
    console.log("Saving file to:", filePath);

    thumbnail.mv(filePath, async (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return next(new HttpError("Error moving file", 500));
      }

      const newPost = await Post.create({
        title,
        category,
        description,
        thumbnail: newFileName,
        creator: req.user.id,
      });
      
      if (!newPost) {
        return next(new HttpError("Failed to create post", 422));
      }

      // Find user and increase post count
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return next(new HttpError("User not found", 404));
      }

      currentUser.posts += 1;
      await currentUser.save();

      res.status(201).json(newPost);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return next(new HttpError("Internal server error", 500));
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
    .populate({
      path: 'comments.postedBy',
      select: 'name'
    });

    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getCategoryPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;

    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields", 422));
    }

    // get old post from db
    const oldPost = await Post.findById(postId);
    if (req.user.id == oldPost.creator) {
      if (!req.files) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description },
          { new: true }
        );
      } else {
        // delete old thumbnail from db
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );

        // upload new thumbnail
        const { thumbnail } = req.files;
        // check file size

        if (thumbnail.size > 2000000) {
          return next(new HttpError("Thumbnail file size exceeds 2MB", 422));
        }

        fileName = thumbnail.name;
        let splittedFilename = fileName.split(".");
        newFileName =
          splittedFilename[0] +
          uuid() +
          "." +
          splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFileName),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );

        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description, thumbnail: newFileName },
          { new: true }
        );
      }
    }
    if (!updatedPost) {
      return next(new HttpError("Failed to update post", 422));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post unavailable", 400));
    }

    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    if (req.user.id == post.creator) {
      // delete thumbnail from uploads folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            // find user and reduce post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            res.json(`Post ${postId} deleted successfully`);
          }
        }
      );
    } else {
      return next(new HttpError("Unauthorized to delete this post", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

const likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return next(new HttpError("Unauthorized. No user found", 401));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      isLiked: !alreadyLiked,
      likes: post.likes,
    });
  } catch (error) {
    return next(new HttpError("Server error", 404));
  }
};

const commentPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return next(new HttpError("Comment text is required", 422));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    post.comments.push({
      text,
      postedBy: userId,
    })

    await post.save();

    const updatedPost = await Post.findById(postId)
    .populate({
      path: 'comments.postedBy',
      select: 'name' // Ensure you include the fields you need
    });

    res.status(201).json({ comments: updatedPost.comments });

  } catch (error) {
    return next(new HttpError("Server error", 404));
  }
};

const commentEdit = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return next(new HttpError("Comment text is required", 422));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return next(new HttpError("Comment not found", 404));
    }

    if (comment.postedBy.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized to edit this comment", 403));
    }

    comment.text = text;
    await post.save();

    const updatedPost = await Post.findById(postId)
    .populate({
      path: 'comments.postedBy',
      select: 'name'
    });

    res.status(200).json({ comments: updatedPost.comments });

  } catch (error) {
    return next(new HttpError("Server error", 500));
  }
}

const commentDelete = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    if (!postId || !commentId) {
      return next(new HttpError("Invalid post or comment ID", 400));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return next(new HttpError("Comment not found", 404));
    }

    if (comment.postedBy.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized to delete this comment", 403));
    }

    post.comments.id(commentId).deleteOne();
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate({
        path: 'comments.postedBy',
        select: 'name'
      });

    res.status(200).json({ comments: updatedPost.comments });

  } catch (error) {
    return next(new HttpError("Server error", 500));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCategoryPosts,
  getUserPosts,
  editPost,
  deletePost,
  likePost,
  commentPost,
  commentEdit,
  commentDelete
};
