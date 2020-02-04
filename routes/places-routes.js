const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const placesControllers = require('../controllers/places-controllers');
const {validate} = require("../middleware/validate");
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const Place = "../models/place.js"

const router = express.Router();

router.get('/:placeId', (req,res,next)=> {
  placesControllers.getPlaceById(req.params.placeId)
  .then((place)=>{
    res.json(place)
  })
  .catch((err)=>{
    next(err);
  })
});


router.get('/user/:userId', (req,res,next)=> {
  placesControllers.getPlacesByUserId(req.params.userId)
  .then((places)=>{
    res.json({places: places.map(place => place.toObject({ getters: true }))})
  })
  .catch((err)=>{
    next(err);
  })
});

router.post(
  '/',
  
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('location')
      .not()
      .isEmpty()
  ],
  validate, 
  (req,res,next)=> {
      placesControllers.createPlace({file: req.file, ...req.body}, req.userData.userId)
      .then((place)=> {
        res.status(201).json({place});
      })
      .catch((error)=>{
         next(error)
      })
    }
  );






router.patch(
  '/:placeId', 
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  validate,
  (req,res,next)=> {
  placesControllers.updatePlace(req.body, req.params.placeId)
  .then((place) => {
  res.status(200).json({ place : place.toObject()});
  })
  .catch((err)=>{
    next(err);
  })
  });

router.delete('/:placeId',
(req,res,next)=> {
 placesControllers.deletePlace(req.params.placeId,req.session.user._id )
 .then((place) => {
  res.status(200).json({ message: 'Deleted place.'});
  })
  .catch((err)=>{
    next(err);
  })
  });
 

module.exports = router;