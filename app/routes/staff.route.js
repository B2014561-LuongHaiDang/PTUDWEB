const express = require("express");
const staff = require("../controllers/staff.controller");
const router = express.Router();

router.route("/")
.get(staff.findAll)
.post(staff.create)
.delete(staff.deleteAll);

router.route("/favorite")
.get(staff.findAllFavorite);

router.route("/:id")
.get(staff.findOne)
.put(staff.update)
.delete(staff.delete);

router.route("/login")
.post(staff.login);

module.exports = router;