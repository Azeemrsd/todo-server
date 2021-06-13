const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/response");

module.exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ")[1];
  if (bearer) {
    req.token = bearer;
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
      if (err) {
       sendResponse(res,false,'Verification failed','Token verification failed!')
      } else {
        req.user = authData.user;
      }
    });
    next();
  } else {
    sendResponse(res, false,403,'Verification failed','Invalid token received')
  }
};
