import blackListedToken from "../model/blackListedToken.js";
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
export const userAuth = async (req, res, next) => {
  try {
    // console.log(req.headers);
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await blackListedToken.find({ token });

    if (isBlacklisted.length) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error.message });
  }
};
