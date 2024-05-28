import express from "express";
import verifyToken from "../middlewares/auth.js";
import {
  Create,
  Postlist,
  getPostById,
  deleteById,
  update,
} from "../controllers/post.js";

const postRouter = express.Router();

postRouter.post("/", verifyToken, Create);
postRouter.get("/", verifyToken, Postlist);
postRouter.get("/:id", verifyToken, getPostById);
postRouter.delete("/:id", verifyToken, deleteById);
postRouter.patch("/:id", verifyToken, update);

export default postRouter;
