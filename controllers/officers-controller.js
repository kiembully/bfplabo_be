const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
// const Order = require('../models/order');
const Officer = require('../models/officers')

const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

// function getFileInfo(files) {
//   const fileInfo = files.map(file => ({
//     originalName: file.originalname,
//     path: file.path,
//   }));

//   return fileInfo;
// }

const createOfficer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs passed, please check your data.', 422)
    return next(error);
  }
  
  const {
    lastName,
    firstName,
    middleName
  } = req.body;

  let existingOfficer;
  try {
    existingOfficer = await Officer.findOne({
      lastName: lastName,
      firstName: firstName,
      middleName: middleName
    });
  } catch (err) {
    const error = new HttpError('Registration failed, please try again later.', 500);
    return next(error)
  }

  if (existingOfficer) {
    const error = new HttpError('Officer exists already, please login instead.', 422);
    return next(error)
  }

  const createdOfficer = new Officer({
    lastName,
    firstName,
    middleName
  })

  try {
    await createdOfficer.save();
  } catch (err) {
    const error = new HttpError('Registration failed, please try again later.', 500);
    return next(error)
  }

  res.status(201).json(
    {
      message: 'Registration Success!',
      officer: {
        id: createdOfficer.toObject({ getters: true }).id,
        lastName: createdOfficer.toObject({ getters: true }).lastName,
        firstName: createdOfficer.toObject({ getters: true }).firstName,
        middleName: createdOfficer.toObject({ getters: true }).middleName
      }
    }
  )
}

const getOfficers = async (req, res, next) => {
  let officers;
  try {
    officers = await Officer.find();
  } catch (err) {
    const error = new HttpError('Unable to get officers, please try again later.', 500)
    return next(error);
  }

  res.status(200).json({officers: officers.map(officer => officer.toObject({ getters: true }))})
};

const getOfficerById = async (req, res, next) => {
  const officerId = req.params.oid

  let officer;
  try {
    officer = await Officer.findById(officerId)
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not find officer.', 500);
    return next(error);
  }

  if (!officer) {
    const error = new HttpError('Could not find a officer for the provided id.', 404);
    return next(error);
  }

  res.status(200).json({officers: officer.map(officer => officer.toObject({ getters: true }))})
};

const updateOfficer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {
    lastName,
    firstName,
    middleName
  } = req.body;
  const officerId = req.params.oid;

  let officer;
  try {
    officer = await Officer.findById(officerId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update officer.', 500);
    return next(error)
  }
  
  officer.lastName = lastName,
  officer.firstName = firstName,
  officer.middleName = middleName

  try {
    await officer.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Updating officer failed, please try again.', 500);
    return next(error);
  }

  res.status(200).json({
    officer: officer.toObject({ getters:true }),
    message: 'Officer successfully updated.'
  });
};

const deleteOfficer = async (req, res, next) => {
  const officerId = req.params.oid;

  let existingOfficer;
  try {
    existingOfficer = await Officer.findById(officerId);
  } catch (err) {
    const error = new HttpError('Unable to delete officers, please try again later.', 500);
    return next(error)
  }

  try {
    await existingOfficer.deleteOne();
  } catch (err) {
    const error = new HttpError('Unable to delete officer could not delete officer.', 500);
    return next(error);
  }

  res.status(200).json({message: 'Officer Deleted.'})
};

exports.createOfficer = createOfficer;
exports.getOfficers = getOfficers;
exports.getOfficerById = getOfficerById;
exports.updateOfficer = updateOfficer;
exports.deleteOfficer = deleteOfficer;