import axios from "axios";

export const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response = await axios.get(`${process.env.BASE_URL}/user/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in userAuth:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const captainAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];
    // console.log(token, "token in userAuth");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const response = await axios.get(
      `${process.env.BASE_URL}/captain/get-captain`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "response data in captainAuth");
    const captain = response.data;
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
