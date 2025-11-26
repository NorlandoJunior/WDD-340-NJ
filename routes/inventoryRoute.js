const express = require("express")
const router = express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")

// View by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail page
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildById)
)

// Management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Add classification (GET)
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Add classification (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkAddClassification,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory (GET)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Add inventory (POST)
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkAddInventory,
  utilities.handleErrors(invController.addInventory)
)

// JSON route for AJAX inventory loading
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Edit inventory item view
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.buildEditInventory)
)

module.exports = router
