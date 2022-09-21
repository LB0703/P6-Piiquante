const Sauce = require("../models/sauces");
const fs = require("fs");
const { STATUS_CODES } = require("http");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

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
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

      // Create function to choise the likes and dislikes
      // If unserId is note in the away for note vote 2 times
exports.ratingSauce = (req, res, next) => {
      // update data base
  if (req.body.like === 1) {
    Sauce.updateOne(
      // retrieve the id of the request object in the mongoDb DB
      {_id: req.params.id},
      {$inc: {likes: 1}, $push: {usersliked: req.body.userId}})

      .then(() => res.status(200).json({message: "Vous aimez cette sauce"}))
      .catch(error => res.status(400).json({ error: error }))
      // The user don't like 
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      {_id: req.params.id},
      {$inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}})

      .then(() => res.status(200).json({message: "Vous n'aimez pas cette sauce"}))
      .catch(error => res.status(400).json({ error: error }))



      // The user wants to remove his like or dislike
  } else {
    Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            {_id: req.params.id},
            { $push: {usersLiked: req.body.userId}, $inc: {dislikes: -1}})
            .then((sauce) => {
              res.status(200).json({message: "Like supprimé"})
            })
            .catch(error => res.status(400).json({ error: error }));
        
           
        }else if(sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            {_id: req.params.id},
            { $push: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
            .then((sauce) => {
              res.status(200).json({message: "Dislike supprimé"});
            })
            .catch(error => res.status(400).json({ error: error }));
        }
    })
      .catch(error => res.status(400).json({ error: error }));
  }
};
      
      
      

      
  







 



//exports.ratingSauce = (req, res, next) => {
//Sauce.findOne({_id: req.params.id})
//    .then((sauce) => {
      // The user has not already liked the sauce and he choise to click on like button
//      if(!usersliked.includes(req.body.userId) && req.body.like === 1) {
      // Updating the sauce data , incrementing the like and push the userliked into the same userId
//        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: +1}, $push: {usersliked: req.body.userId}})
 //         .then(() => res.status(200).json({message: "Vous aimé cette sauce"}))
 //         .catch(error => res.status(400).json({ error: error }))
          
 //     }else if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){   
 //       Sauce.updateOne({_id: req.params.id}), {$inc: {likes: -1}, $push: {usersliked: req.body.userId}}
 //       .then(() => res.status(200).json({message: "Vous avez décider de ne pas liké"}))
 //       .catch(error => res.status(400).json({ error: error }))

 //     }else if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
//        Sauce.updateOne({_id: req.params.id}), {$inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}}
//        .then(() => res.status(200).json({message: "Vous n'aimez pas cette sauce"}))
 //       .catch(error => res.status(400).json({ error: error }))

  //    }else if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
  //      Sauce.updateOne({_id: req.params.id}), {$inc: {dislikes: -1}, $push: {usersDisliked: req.body.userId}}
 //       .then(() => res.status(200).json({message: "Vous avez décider de ne pas liké"}))
 //       .catch(error => res.status(400).json({ error: error }))

 //     }else{
 //       return res.status(401).json({message: "une erreur est survenue"})
//      }
//    })
//    .catch(error => res.status(400).json({ error: error }));
//};