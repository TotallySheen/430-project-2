const mongoose = require('mongoose');
const _ = require('underscore');

let DrawingModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DrawingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  encode: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DrawingSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  encode: doc.encode,
});

DrawingSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DrawingModel.find(search).select('name encode').lean().exec(callback);
};

DrawingSchema.statics.findAll = (callback) => DrawingModel.find().select('name encode').lean().exec(callback);

DrawingModel = mongoose.model('Drawing', DrawingSchema);

module.exports = {
  DrawingModel,
  DrawingSchema,
};
