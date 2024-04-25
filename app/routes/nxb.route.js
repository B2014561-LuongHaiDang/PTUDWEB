const express = require("express");
const nxbs = require("../controllers/nxb.controller");
const router = express.Router();

router.route("/")
.get(nxbs.findAll)
.post(nxbs.create)
.delete(nxbs.deleteAll);

router.route("/favorite")
.get(nxbs.findAllFavorite);

router.route("/:id")
.get(nxbs.findOne)
.put(nxbs.update)
.delete(nxbs.delete);

module.exports = router;