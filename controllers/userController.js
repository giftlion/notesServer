const User = require("../models/userModel.js");
const { hash, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const usetCtrl = {
  async getUsers(req, res, next) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (stack) {
      next({ stack });
    }
  },
  async addNewNote(req, res, next) {
    try {
      const { _id, content, bgColor, date, pin } = req.body;
      const userid = req.user.id;
      const user = await User.findById(userid);
      user.notes.push({ _id, content, bgColor, date, pin });
      await user.save();
      res.status(201).json({ message: "Note added successfully" });
    } catch (error) {
      next(error);
    }
  },
  async deleteNote(req, res, next) {
    try {
      const { _id } = req.body;
      const userid = req.user.id;
      const user = await User.findById(userid);
      const noteIndex = user.notes.findIndex((note) => note._id === _id);
      user.notes.splice(noteIndex, 1);
      await user.save();
      res.status(201).json({ message: "Note deleted successfully" });
    } catch (error) {
      next({ error });
    }
  },
  async editNote(req, res, next) {
    try {
      const { _id, content, bgColor, date, pin } = req.body;
      const userid = req.user.id;
      const user = await User.findById(userid);
      const note = user.notes.find((note) => note._id.toString() === _id);
      note.content = content;
      note.bgColor = bgColor;
      note.date = date;
      note.pin = pin;
      await user.save();
      res.status(201).json({ message: "Note edited successfully" });
    } catch (error) {
      next({ error });
    }
  },
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      // Check if user with the given email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      //   const hashedPassword = await hash(password, 10);
      const newUser = new User({
        email: email,
        password: password,
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  },
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      // const isPasswordCorrect = await compare(password, user.password);
      if (password !== user.password) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const accessToken = sign(
        { email: user.email, id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      delete user.password;
      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        })
        .status(200)
        .json({ msg: "login successfully", user });
    } catch (error) {
      next(error);
    }
  },
  async logout(req, res, next) {
    try {
      res.clearCookie("access_token").json({ msg: "logout successfully" });
    } catch (error) {
      res.json({ error });
      // next(error);
    }
  },
};

module.exports = usetCtrl;
