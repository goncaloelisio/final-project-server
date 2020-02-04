

const Place = require ('../models/place');
const HttpError = require('../models/http-error');

const fs = require ('fs');


const getPlaceById = async (placeId) => {

  try{
    let place = await Place.findById(placeId);
    if (!place) throw new HttpError('Could not find a place for the provided id.', 404);
    else return place
  }catch (err){
    throw new HttpError('Something went wrong, could not find a place.', 500);
  }
  
};


const getPlacesByUserId =  async (userId) => {
  
  let places;
  try{
    places = await Place.find({creator: userId})
  }catch (err){
    throw new HttpError('Fetching places failed.', 500);
  }
  if (!places || places.length === 0) {
    throw new HttpError('Could not find places for the provided user id.', 404)
  };

  return places;
};



const createPlace = async (place, userId) => {
let newPlace;
try{
  newPlace = await new Place({
    ...place,
    image: place.file.path,
    creator: userId
  })
} catch (err){
  console.log(err.message);
  throw new HttpError('Creating place failed, try again.', 500);
}
  return newPlace.save();

};

const updatePlace = async (placeUpdate, placeId) => {

  try{
    place = await Place.findById(placeId);
  }catch (err){
    console.log(err.message);
    throw new HttpError('Something failed, could not update the place.', 500);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this place.',
      401
    );
    return next(error);
  }
    place = {...place, ...placeUpdate}; // equivalent to Object.assign(place, placeUpdate);

    try {
      await place.save();
    } catch (err){
      console.log(err.message);
      throw new HttpError('Something went wrong, could not update the place.', 500);
    }

  return place;
};

const deletePlace = async (placeId,userId) => {
  
  try{
    place = await (await Place.findById(placeId));
  }catch (err){
    console.log(err.message);
    throw new HttpError('Something failed, could not delete the place.', 500);
  }

  if(!place) {
    throw new HttpError('Could not find a place for this id.', 404);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this place.',
      403
    );
    return next(error);
  }

  const imagePath = place.image;

  try{
    await place.remove();
  }catch (err){
    console.log(err.message);
    throw new HttpError('Something went wrong, could not delete the place.', 500);
  }

  fs.unlink(imagePath,err => {
    console.log(err);
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;