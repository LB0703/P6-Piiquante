// Importing the sauce model
const Sauce = require("../models/sauces");
// Importing the file system (fs) package containing functions to modify the file system and file deletion
const fs = require("fs");

// Function to create a new sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    // Spread operator copies all created req.body elements
    ...sauceObject,
    userId: req.auth.userId,
    // Dynamically retrieving the image url
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Save method to save Sauce in the database
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Export of the "modifySauce" function allowing to modify a sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Verification if the user who made the modification request is the one who created the sauce
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        // We retrieve the content of the image file in the request
        const reqFile = req.file;
        // If it does not exist, we update the modifications
        if (!reqFile) {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => {
              res.status(200).json({ message: "Sauce modifiée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
        // We retrieve the name of the image file of the sauce in the 'images' folder
        const filename = sauce.imageUrl.split("/images/")[1];
        // Then we delete it with 'unlink' and finally we update the modifications
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => {
              res.status(200).json({ message: "Sauce modifiée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Export "deleteSauce" function to delete a sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // check if the user who made the deletion request is the one who created the sauce
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        // We delete the image file of the sauce
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Export of the "getOneSauce" function to display a specific sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

// Export of the "getAllSauces" function allowing to display all the sauces of the database
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//////////////////////////////// Create function to choise the likes and dislikes
// If unserId is note in the away for note vote 2 times
exports.ratingSauce = (req, res, next) => {
  // We retrieve the userId
  let userId = req.body.userId;
  // We retrieve the sauceId
  let sauceId = req.params.id;
  // We retrieve the like of the body request
  let like = req.body.like;

  if (like === 1) {
    // If the user clicks the Like for the first time, we update the sauce with this Id
    Sauce.updateOne(
      { _id: sauceId },
      {
        // We add a Like the userId to the array of usersLiked
        $push: { usersLiked: userId },
        // We increment likes
        $inc: { likes: +1 },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous avez Liké cette sauce !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }

  if (like === -1) {
    // If the user clicks disLike for the first time, we update the sauce with this Id
    Sauce.updateOne(
      { _id: sauceId },
      {
        // We add a dislike the userId to the array of usersDisliked
        $push: { usersDisliked: userId },
        // We increment dislikes
        $inc: { dislikes: +1 },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous avez Disliké cette sauce !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }

  // Delete like or dislike
  if (like === 0) {
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        // Delete like
        // If the user has already clicked on the like so if the userId is included in the table of usersLiked
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            // We remove the userId from the table of usersLiked and we decrement likes
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() =>
              res.status(200).json({ message: "Votre Like a été retiré !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
        // Delete dislike
        // If the user has already thumb clicked disLike so if the userId is included in the array of usersDisliked
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            // We remove the userId from the table of usersDisliked and we decrement disLikes
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() =>
              res.status(200).json({ message: "Votre Dislike a été retiré !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
