const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const Order = require('../models/order');
const User = require('../models/user');

const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

function getFileInfo(files) {
  const fileInfo = files.map(file => ({
    originalName: file.originalname,
    path: file.path,
  }));

  return fileInfo;
}

const getOrderById = async (req, res, next) => {
  const orderId = req.params.oid;
  
  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not find such order.', 500);
    return next(error);
  };
  
  if (!order) {
    const error = new HttpError('Could not find a order for the provided id.', 404);
    return next(error);
  }

  res.json({order: order.toObject( {getters: true} )});
};

const getOrdersByUserId = async (req, res, next) => {
  const userID = req.params.uid;
  let orders;

  try {
    orders = await Order.find({ creator: userID });
  } catch (err) {
    const error = next(new HttpError('Fetching orders failed, please try again later.', 404))
    return next(error);
  }
  
  if (!orders || orders.length === 0) {
    const error = next(new HttpError('Could not find a orders for the provided id.', 404))
    return next(error)
  }

  res.json({orders: orders.map(order => order.toObject({ getters: true}))})
}

const getOrdersByWriter = async (req, res, next) => {
  const writerID = req.params.uid;
  let orders;

  try {
    orders = await Order.find({ writer: writerID });
  } catch (err) {
    const error = next(new HttpError('Fetching orders failed, please try again later.', 404))
    return next(error);
  }
  
  if (!orders || orders.length === 0) {
    const error = next(new HttpError('Could not find a orders for the provided id.', 404))
    return next(error)
  }

  res.json({orders: orders.map(order => order.toObject({ getters: true}))})
}

const getAllOrders = async (req, res, next) => {
  
  const { orderStatus, writer, creator } = req.query;
  
  let orders;
  try {
    if (Object.keys(req.query).length > 0) {
      const queryParameters = {}
      if (orderStatus !== undefined) queryParameters.orderStatus = orderStatus;
      // dapat ma utilize din kahit undefined yung writer for open orders ng writers 
      if (writer !== undefined) {
        if (writer === '') {
          queryParameters.writer = { $in: [writer, undefined] } ;
        } else {
          queryParameters.writer = writer;
        }
      }
      if (creator !== undefined) queryParameters.creator = creator;

      orders = await Order.find(queryParameters);
    } else {
      orders = await Order.find();
    }
  } catch (err) {
    console.log(err)
    const error = new HttpError('Unable to get orders, please try again later.', 500)
    return next(error);
  }

  res.status(200).json({orders: orders.map(order => order.toObject({ getters: true }))})
};

const createOrder = async (req, res, next) => { // create order to existing user
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {
    typeOfService,
    otherTypeOfService,
    subject,
    totalPage,
    topic,
    details,
    sources,
    academicLevel,
    formatStyle,
    paperType,
    spacing,
    otherSpacing,
    optionalNeeds,
    totalChart,
    timezone,
    deadline,
    deadlineInPh,
    orderStatus,
    isFullyPaid,
    discount,
    coupon,
    price,
    discountedPrice,
    creator,
    writer,
    transactionLog,
    paymentDetails,
    clientFiles
  } = req.body;

  const createdorder = new Order({
    typeOfService,
    otherTypeOfService,
    subject,
    totalPage,
    topic,
    details,
    sources,
    academicLevel,
    formatStyle,
    paperType,
    spacing,
    otherSpacing,
    optionalNeeds,
    totalChart,
    timezone,
    deadline,
    deadlineInPh,
    orderStatus,
    isFullyPaid,
    discount,
    coupon,
    price,
    discountedPrice,
    creator,
    writer,
    transactionLog: [transactionLog],
    paymentDetails: [paymentDetails],
    clientFiles: getFileInfo(req.files)
  });

  let user; // check relation between order and user
  try {
    user = await User.findById(creator)
  } catch (err) {
    const error = new HttpError('Creating order failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdorder.save({ session: sess });
    user.orders.push(createdorder);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Creating order failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({
    message: 'Order successfully created.',
    order: createdorder
  })
}

const updateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {
    typeOfService,
    otherTypeOfService,
    subject,
    totalPage,
    topic,
    details,
    sources,
    academicLevel,
    formatStyle,
    paperType,
    spacing,
    otherSpacing,
    optionalNeeds,
    totalChart,
    timezone,
    deadline,
    deadlineInPh,
    orderStatus,
    isFullyPaid,
    discount,
    coupon,
    price,
    discountedPrice,
    creator,
    writer,
    transactionLog,
    paymentDetails,
    clientFiles,
    // writerFiles
  } = req.body;
  const orderId = req.params.oid;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error)
  }
  
  order.typeOfService = typeOfService,
  order.otherTypeOfService = otherTypeOfService,
  order.subject = subject,
  order.totalPage = totalPage,
  order.topic = topic,
  order.details = details,
  order.sources = sources,
  order.academicLevel = academicLevel,
  order.formatStyle = formatStyle,
  order.paperType = paperType,
  order.spacing = spacing,
  order.otherSpacing = otherSpacing,
  order.optionalNeeds = optionalNeeds,
  order.totalChart = totalChart,
  order.timezone = timezone,
  order.deadline = deadline,
  order.deadlineInPh = deadlineInPh,
  order.orderStatus = orderStatus,
  order.isFullyPaid = isFullyPaid,
  order.discount = discount,
  order.coupon = coupon,
  order.price = price,
  order.discountedPrice = discountedPrice,
  order.creator = creator,
  order.writer = writer,
  order.transactionLog = order.transactionLog.concat(transactionLog),
  order.paymentDetails = order.paymentDetails.concat(paymentDetails),
  order.clientFiles = getFileInfo(req.files)

  try {
    await order.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Updating order failed, please try again.', 500);
    return next(error);
  }

  res.status(200).json({
    order: order.toObject({ getters:true }),
    message: 'Order successfully updated.'
  });
};

const updateWriterOrderFiles = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {
    writerFiles
  } = req.body;
  const orderId = req.params.oid;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error)
  }

  const newWriterFiles = getFileInfo(req.files);
  order.writerFiles = order.writerFiles.concat(newWriterFiles);

  try {
    await order.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error);
  }

  res.status(200).json({
    order: order.toObject({ getters:true }),
    message: 'Order successfully updated.'
  });
};

const updateClientrOrderFiles = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {
    clientFiles
  } = req.body;
  const orderId = req.params.oid;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error)
  }

  const newClientFiles = getFileInfo(req.files);
  order.clientFiles = order.clientFiles.concat(newClientFiles);

  try {
    await order.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error);
  }

  res.status(200).json({
    order: order.toObject({ getters:true }),
    message: 'Order successfully updated.'
  });
};

const updateOrderByAssignedWriter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }
  
  const {
    writer,
    transactionLog
  } = req.body;
  const orderId = req.params.oid;

  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error)
  }

  order.writer = writer
  order.transactionLog = order.transactionLog.concat(transactionLog)
  
  let user; // check relation between order and user
  try {
    user = await User.findById(order.writer)
  } catch (err) {
    const error = new HttpError('Creating order failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find Writer for provided id.', 404);
    return next(error);
  }
  // Check if the order is already assigned to the writer
  // prevent duplicate entries of assigned orders to writers
  if (user.assignedOrders.includes(order._id)) {
    const error = new HttpError('Order is already assigned to the writer.', 422);
    return next(error);
  }

  // get previous writer 
  let previousUsers;
  try {
    previousUsers = await User.find({ assignedOrders: order._id }).distinct('_id');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update order.', 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Remove the order from the assignedOrders of all users
    for (const id of previousUsers) {
      const assignedUser = await User.findById(id);
      if (assignedUser) {
        assignedUser.assignedOrders = assignedUser.assignedOrders.filter(
          (assignedOrderId) => assignedOrderId.toString() !== order._id.toString()
        );
        await assignedUser.save({ session: sess });
      }
    }
    // Pull out the order._id from assignedOrders of users identified by orderAssignedUserIds
    await User.updateMany(
      { _id: { $in: previousUsers } },
      { $pull: { assignedOrders: order._id } },
      { session: sess }
    );
    
    await order.save({ session: sess });
    user.assignedOrders.push(order);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Updating order failed, please try again.', 500);
    return next(error);
  }

  res.status(200).json({
    order: order.toObject({ getters:true }),
    message: 'Order successfully updated.'
  });
};

const deleteOrder = async (req, res, next) => {
  const orderId = req.params.oid;
  let order;
  
  try {
    order = await Order.findById(orderId).populate('creator');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete order.', 500);
    return next(error);
  }

  // check if order id exist
  if (!order) {
    const error = new HttpError('Could not find order for this id.', 404)
    return next(error)
  }
  
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await order.deleteOne({session: sess});
    order.creator.orders.pull(order);
    await order.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete order.', 500);
    return next(error);
  }
  
  res.status(200).json({message: 'order Deleted.'})
};

exports.getOrderById = getOrderById;
exports.getOrdersByUserId = getOrdersByUserId;
exports.getOrdersByWriter = getOrdersByWriter;
exports.getAllOrders = getAllOrders;
exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
exports.updateOrderByAssignedWriter = updateOrderByAssignedWriter;
exports.deleteOrder = deleteOrder;
exports.updateWriterOrderFiles = updateWriterOrderFiles;
exports.updateClientrOrderFiles = updateClientrOrderFiles;