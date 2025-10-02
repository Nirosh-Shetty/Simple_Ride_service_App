import blackListedToken from "../model/blackListedToken.js";
import jwt from "jsonwebtoken";
import captainModel from "../model/captain.model.js";
export const captainAuth = async (req, res, next) => {
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

    const captain = await captainModel.findById(decoded.id);

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.captain = captain;
    next();
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error.message });
  }
};
