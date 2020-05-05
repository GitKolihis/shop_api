const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix+ "-" +file.originalname );
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", checkAuth, ProductsController.product_get_all);

router.post("/", checkAuth, upload.single("productImage"), ProductsController.product_create);

router.get("/:productId", checkAuth, ProductsController.product_delete_id);

router.patch("/:productId", checkAuth, ProductsController.product_update);

router.delete("/:productId", checkAuth, ProductsController.product_delete_id);

module.exports = router;
