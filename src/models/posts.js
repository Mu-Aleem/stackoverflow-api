import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
