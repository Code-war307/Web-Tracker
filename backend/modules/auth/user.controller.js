import jwt from "jsonwebtoken"
import User from "./user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All Fields should be filled" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({username, email, password: hashedPassword})

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        }
      });
    }
  } catch (error) {
    console.error("Error in Signup controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in Login controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};