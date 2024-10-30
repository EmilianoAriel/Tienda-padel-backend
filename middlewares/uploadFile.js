const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (req.originalUrl.includes("/users")) {
      folderPath = "public/images/users";
    } else if (req.originalUrl.includes("/products")) {
      folderPath = "public/images/products";
    }

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const name = crypto.randomUUID();
    console.log(file);
    const filname = name + path.extname(file.originalname);

    // if(file.size > 1024){
    //     cb(new Error('File is too large'),false)
    // }

    cb(null, filname);
  },
});

const upload = multer({ storage }).single("image");

module.exports = upload;
