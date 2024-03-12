const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "the server is running" });
});

app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin: process.env.URLS.split(";"),
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"],
    credentials:true
}))

// Connect to MongoDB
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoDB"));

// connecting to user route
const userRouter = require("./routes/usersRoutes.routes");
app.use("/users", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
