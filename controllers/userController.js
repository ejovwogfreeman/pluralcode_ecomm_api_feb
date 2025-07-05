import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @desc   Register a new user
// @route  POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "Email already in use" });

    const newUser = await User.create({
      name,
      email,
      password, // will be hashed by pre("save") hook
    });

    const token = newUser.generateToken();

    res.status(201).json({
      msg: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        profilePic: newUser.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// @desc   Login user
// @route  POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = user.generateToken();

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// @desc   Update profile info (name, email, password)
// @route  PUT /api/users/profile
// @access Private
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt); // hash manually since password already hashed before
    }

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// @desc   Update profile picture
// @route  PATCH /api/users/profile-pic
// @access Private
const updateProfilePic = async (req, res) => {
  const { profilePic } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profilePic = profilePic;
    await user.save();

    res.json({
      msg: "Profile picture updated successfully",
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// @desc   Get single user by ID
// @route  GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// @desc   Get all users
// @route  GET /api/users
// @access Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  updateProfilePic,
  getAllUsers,
  getUserById,
};
