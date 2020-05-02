const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  //   res.status(200).json({
  //     message: "Handling GET request to /products",
  //   });

  Product.find()
    .select('name price _id')
    .exec()
    .then((docs) => {
      // const response = {
      //   count: docs.length,
      //   products: docs
      // };

      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products' + doc._id
            }
          }
        })
      };

      res.status(200).json(response);

      // if (docs.length >= 0)  {
      //   res.status(200).json(docs);
      // }else {
      //   res.status(404).json({
      //     message: 'No Entries found'
      //   });
      // }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  // const product = {
  //     name: req.body.name,
  //     price: req.body.price
  // }

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product Creadted Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: "http://localhost:3000/products/"
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });

  // res.status(200).json({
  //     message: 'Handling POST request to /products',
  //     createdProduct: product
  // });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // if (id === 'special') {
  //     res.status(200).json({
  //         message: 'You just discovered the special ID',
  //         id: id
  //     });
  // } else {
  //     res.status(200).json({
  //         message: 'You Passed an ID'
  //     });
  // }

  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid Product Id found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  // Product.update({ _id: id }, {$set: {name: req.body.newName, price: req.body.newPrice}})
  Product.update({ _id: id }, {$set: updateOps})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
