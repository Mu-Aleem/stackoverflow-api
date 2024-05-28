import User from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return next(createHttpError(400, "Please provide all required fields"));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(
        createHttpError(400, "User with that email or username already exists.")
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User register successfully",
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while creating  account."));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(createHttpError(400, "Please provide all required fields"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(400, "User not found."));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "invalid credentials." });
    }

    // Generate JWT token one week (604800 seconds)

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 604800,
    });

    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "User login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while login  account."));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while login  account."));
  }
};

export { register, login, getUser };
