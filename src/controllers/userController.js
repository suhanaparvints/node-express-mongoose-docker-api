import User from "../models/User.js";

const publicUser = (user) => ({
  id: user._id.toString(),
  userId: user.userId,
  name: user.name,
  age: user.age,
  email: user.email,
  address: user.address,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getAllUsers = async (req, res) => {
  const users = await User.find();

  return res.status(200).json({
    status: "OK",
    data: users.map(publicUser),
  });
};

export const nameUpdate = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.name = req.body.name;
  await user.save();

  return res.status(200).json({
    status: "OK",
    data: publicUser(user),
  });
};

export const replaceUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.name = req.body.name;
  user.age = req.body.age;
  user.email = req.body.email;
  user.address = req.body.address;
  await user.save();

  return res.status(200).json({
    status: "OK",
    data: publicUser(user),
  });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    status: "OK",
    data: publicUser(user),
  });
};
