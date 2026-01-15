import jwt from "jsonwebtoken"
import User from "./user.model"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All Fields should be filled" });
    }

    if (password.length < 8) {
      return res
        .status(404)
        .json({ message: "Password must be atleast 8 characters" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({username, email, password: hashedPassword})

    
  } catch (error) {
    console.error("Error in Signup controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};