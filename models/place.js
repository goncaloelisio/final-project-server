const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {type: String, required: true},
    image: {
        type: String, 
        required: true, 
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTIKhLKZN-ObMlKWCFolVAtMCBQyMU4MLoF1jSivQvWeUH2Tle9'},
    description:{type: String, required: true},
    location: {type: String, required: true},
    creator: {type:mongoose.Types.ObjectId, required: true, Ref:'User'}
});

module.exports = mongoose.model('Place', placeSchema);

