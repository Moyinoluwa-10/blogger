const User = require("../models/user.model");

const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find().select({ password: false });

    return res.json({
      status: true,
      user,
    });
  } catch (err) {
    err.source = "get all users controller";
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select({ password: false })
      .populate("blogs");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "This user does not exist",
      });
    }

    return res.json({
      status: true,
      user,
    });
  } catch (err) {
    err.source = "get user controller";
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUser,
};
