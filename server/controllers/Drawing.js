const models = require('../models');

const { Drawing } = models;

const postDrawing = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Please enter a name' });
  }

  const drawingData = {
    name: req.body.name,
    encode: req.body.encode,
    owner: req.session.account._id,
  };

  const newDrawing = new Drawing.DrawingModel(drawingData);

  const drawingPromise = newDrawing.save();

  drawingPromise.then(() => res.json({ redirect: '/make' }));

  drawingPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Drawing already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return drawingPromise;
};

const makerPage = (req, res) => res.render('make', { csrfToken: req.csrfToken() });

const getDrawings = (request, response) => {
  const req = request;
  const res = response;

  return Drawing.DrawingModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ drawings: docs, owner: req.session.account._id });
  });
};
module.exports = {
  makerPage,
  make: postDrawing,
  getDrawings,
};
