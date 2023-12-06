const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error')
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Unable to get users, please try again later.', 500)
    return next(error);
  }

  res.status(200).json({users: users.map(user => user.toObject({ getters: true }))})
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid

  let user;
  try {
    user = await User.findById(userId)
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not find user.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find a user for the provided id.', 404);
    return next(error);
  }

  res.status(201).json(
    {
      message: 'Success!',
      user: {
        id: user.toObject({ getters: true }).id,
        name: user.toObject({ getters: true }).name,
        email: user.toObject({ getters: true }).email,
        userType: user.toObject({ getters: true }).userType,
        orders: user.toObject({ getters: true }).orders,
        assignedOrders: user.toObject({ getters: true }).assignedOrders,
      }
    }
  )
};

const getUsersByUserType = async (req, res, next) => {
  const userId = req.params.uid
  
  let users;
  try {
    users = await User.find({ userType: userId }, '-password');
  } catch (err) {
    const error = new HttpError('Unable to get users, please try again later.', 500);
    return next(error);
  }

  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs passed, please check your data.', 422)
    return next(error);
  }
  
  const { name, email, password, userType, dateJoined, lastLoggedIn } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422);
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    password,
    userType,
    dateJoined,
    lastLoggedIn
  })

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error)
  }

  res.status(201).json(
    {
      message: 'Success!',
      user: {
        id: createdUser.toObject({ getters: true }).id,
        name: createdUser.toObject({ getters: true }).name,
        email: createdUser.toObject({ getters: true }).email
      }
    }
  )
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.', 500);
    return next(error)
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials.', 401)
    return next(error);
  }

  // Update lastLoggedIn field
  try {
    await User.findOneAndUpdate({ email: email }, { $set: { lastLoggedIn: new Date() } });
  } catch (err) {
    const error = new HttpError('Error updating lastLoggedIn.', 500);
    return next(error);
  }

  res.status(200).json(
    {
      message: 'Logged in!',
      user: {
        id: existingUser.toObject({ getters: true }).id,
        name: existingUser.toObject({ getters: true }).name,
        email: existingUser.toObject({ getters: true }).email,
        userType: existingUser.toObject({ getters: true }).userType
      }
    }
  )
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {
    name,
    email,
    password,
    userType
    
  } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user.', 500);
    return next(error)
  }
  
  user.name = name,
  user.email = email,
  user.password = password,
  user.userType = userType

  try {
    await user.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Updating order failed, please try again.', 500);
    return next(error);
  }

  res.status(200).json({
    order: order.toObject({ getters:true }),
    message: 'User successfully updated.'
  });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Unable to delete users, please try again later.', 500);
    return next(error)
  }

  try {
    await existingUser.deleteOne();
  } catch (err) {
    const error = new HttpError('Unable to delete user could not delete order.', 500);
    return next(error);
  }

  res.status(200).json({message: 'User Deleted.'})
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUsersByUserType = getUsersByUserType;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;