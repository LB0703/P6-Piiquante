// Importing multer
const multer = require("multer");

// We define the format of the images received
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Creating multer configuration's object
const storage = multer.diskStorage({
  // Defining images folder as destination
  destination: (req, file, callback) => {
    //We check that there is no error (null) and we indicate the destination folder (images)
    callback(null, 'images');
  },
  // We change the name of the file
  filename: (req, file, callback) => {
    // We replace any spaces with an underscore
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    // We add the date to the name to be sure to have a unique file name
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exporting the multer middleware
module.exports = multer({storage: storage}).single('image');