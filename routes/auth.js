const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schema/user.js");
const config = require("config");

router.get("/", (req, res) => {
  res.render("signup",{error:null});
});
router.get("/signup", (req, res) => {
  res.render("signup",{error:null});
});

router.get("/login", (req, res) => {
  res.render("login",{error:null});
});

router.post("/signup", async (req, res) => {
  console.log("Req", req.body);

  const { username, email, password } = req.body;
  try {
    // Check if user with the same email already exists
    let user = await User.findOne({ email });
    if (user) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "User already exists" });
      // Some logic that may generate an error

      res.render("signup", { error: "User already exists" });

      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, config.get("jwtPrivateKey"));
    // localStorage.setItem("token", token);
    req.session.token = token;

    // res.status(201).json({ success: true, token });
    res.redirect(200, "/books-list");
  } catch (err) {
    res.render("signup", { error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found" });
    res.render("login", { error: "User not found" });

    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.render("login", { error: "Invalid password" });

    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, config.get("jwtPrivateKey"));
    // localStorage.setItem("token", token);
    req.session.token = token;

    res.redirect("/books-list");
    // res.status(200).json({ success: true, token });
  } catch (err) {
    // res.status(500).json({ success: false, message: err.message });
    res.render("login", { error:err.message });

  }
});

module.exports = router;
