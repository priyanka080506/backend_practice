import { User } from "../models/user.model.js";

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // basic validation
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "All fields are required!"
      });
    }

    // check if user already exists
    const existing = await User.findOne({
      email: email.toLowerCase()
    });

    if (existing) {
      return res.status(409).json({
        message: "User already exists. Please login!"
      });
    }

    // ❗ DO NOT hash password here
    // model pre-save hook will hash it
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password // plain password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // ✅ use model method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

//Logout part
const logoutUser = async (req, res) => {
  try {
    // Invalidate the user's session or token here (e.g., clear cookies, remove token from storage)
    const { email} = req.body;
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if(!user) return res.status(400).json({
      message: "User not found"
    });
    return res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser
};
