const sauces = require('../models/sauces');

exports.createSauces = (req, res, next) => {
  const Sauces = new sauces({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });

  Sauces.save().then(() => {
      res.status(201).json({ message: 'Post saved successfully!'});
    }
  ).catch(
    (error) => { res.status(400).json({ error: error});
    }
  );
};

exports.getOneSauces = (req, res, next) => {
  sauces.findOne({ _id: req.params.id})
  .then((Sauces) => {
      res.status(200).json(Sauces);
    }
  ).catch(
    (error) => {res.status(404).json({error: error});
    }
  );
};

exports.modifySauces = (req, res, next) => {
  const Sauces = new sauces({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  sauces.updateOne({_id: req.params.id}, Sauces).then(() => {
      res.status(201).json({message: 'Thing updated successfully!'});
    }
  ).catch(
    (error) => {
      res.status(400).json({error: error});
    }
  );
};

exports.deleteSauces = (req, res, next) => {
  sauces.deleteOne({_id: req.params.id})
  .then(() => {
      res.status(200).json({message: 'Deleted!'});
    }
  ).catch(
    (error) => {
      res.status(400).json({error: error});
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  sauces.find()
  .then((Sauces) => {
      res.status(200).json(Sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({error: error});
    }
  );
};
