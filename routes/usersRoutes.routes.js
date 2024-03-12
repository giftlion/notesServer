const router = require("express").Router();
const {
  getUsers,
  register,
  addNewNote,
  deleteNote,
  editNote,
  login,
  logout,
} = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");


// routes
router.get("/", getUsers);

router.post("/register", register);

router.post("/login",  login);

router.post("/logout", auth , logout);

router.put("/addNote/:id", auth , addNewNote);

router.delete("/deleteNote/:id", auth , deleteNote);

router.put("/editNote/:id", auth , editNote);


// error handler
router.use((err, req, res, next) => {
  const errorObj = {};
  if (err.msg) errorObj.msg = err.msg;
  if (err.stack) errorObj.stack = err.stack;
  if (process.env.MODE == "production" || !Object.keys(errorObj).length) {
    return res.status(err.status ?? 500).send("there was an error");
  }
  res.status(err.status ?? 500).json(errorObj);
});

module.exports = router;
