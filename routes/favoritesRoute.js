const express = require("express")
const router = express.Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities/")

// Show favorites list page
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.buildFavorites)
)

// Toggle favorite
router.post(
  "/toggle",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.toggleFavorite)
)

module.exports = router
