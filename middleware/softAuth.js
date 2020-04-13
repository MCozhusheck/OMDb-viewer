const jwt = require("jsonwebtoken");
const User = require("../db/model");

const softAuth = async (req, res, next) => {
  if(req.header("Authorization") === undefined) {
    req.user = null;
    next();
  } else {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
        req.user = null;
        next();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next();
  }
}
};
module.exports = softAuth;