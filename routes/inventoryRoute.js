const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// List vehicles by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail page
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildById)
)

module.exports = router
