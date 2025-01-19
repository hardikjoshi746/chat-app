const bcrypt = require("bcrypt");
const { User, validateRegister } = require("../models/userModel");
const { Token } = require("../models/tokenModel.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

const registerController = async (req, res) => {
  try {
    // Validate the registration data
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if user with the given email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user && user.verified) {
      return res
        .status(409)
        .send({ message: "User with given email already exists" });
    }

    if (user && user.verificationLinkSent) {
      return res.status(400).send({
        message: "A verification link has already been sent to this email.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Save the user with hashed password
    user = new User({
      ...req.body,
      password: hashPassword,
    });
    await user.save();

    // Generate a verification token and send an email
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    }).save();

    const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    // Mark verification link as sent
    user.verificationLinkSent = true;
    await user.save();

    res.status(201).send({
      message: `Verification Email Sent to ${user.email}. Please check your inbox.`,
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = registerController;
