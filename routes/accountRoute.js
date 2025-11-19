const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route for "My Account" page
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
)

module.exports = router
