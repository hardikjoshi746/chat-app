const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

// Controller to fetch user profile
const profileController = async (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(userData._id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Controller to update user profile
const profileUpdate = async (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);

    const { firstName, lastName, email, avatarLink } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userData._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.avatarLink = avatarLink || user.avatarLink; // Optional avatar update

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { profileController, profileUpdate };
