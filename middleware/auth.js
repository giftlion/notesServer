const { verify } = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies["access_token"];
    if (!accessToken) return next({ status: 401, msg: "unauthorized" });

    const { email, id } = verify(accessToken, process.env.SECRET_KEY);
    req.user = { email, id };
    next();
  } catch (stack) {
    next({ status: 401, msg: "unauthorized", stack });
  }
};

module.exports = auth;
