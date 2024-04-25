const express = require("express");
const biils = require("../controllers/bill.controller");

const router = express.Router();

router.route("/")
.get(biils.findAll)
.post(biils.create)
// .delete(biils.deleteAll);

router.route("/:id")
// .get(biils.findOne)
.put(biils.update)
// .delete(biils.delete);

module.exports = router;