const express = require("express");
const { uploadImages } = require("../controllers/upload")
const uploadImagefiles=require("../middlewares/imagesUpload")
const { authUser } = require("../middlewares/auth");
const router = express.Router();
router.post("/uploadImages", uploadImagefiles, uploadImages);
module.exports = router;
