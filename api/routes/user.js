const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UsersController = require('../controllers/users');

router.post("/signup", UsersController.users_signup);

router.post("/login", UsersController.users_login);

router.delete("/:userId", UsersController.users_delete);

module.exports = router;
