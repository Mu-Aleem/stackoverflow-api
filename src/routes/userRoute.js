import express from "express";
import { register, login, getUser } from "../controllers/user.js";

const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
// Router.get("/me", verifyToken, getUser);

export default Router;
