const express = require("express")
const router = express.Router()

const invController = require("../controllers/invController")
console.log("invController:", Object.keys(invController))

const utilities = require("../utilities/index.js")
console.log("utilities:", Object.keys(utilities))

const invValidate = require("../utilities/inv-validation")

// View by classification (public)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail page (public)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildById)
)

// Management view (protected)
router.get(
  "/",
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagement)
)

// Add classification (GET) - protected
router.get(
  "/add-classification",
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification)
)

// Add classification (POST) - protected
router.post(
  "/add-classification",
  utilities.checkAccountType, 
  invValidate.classificationRules(),
  invValidate.checkAddClassification,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory (GET) - protected
router.get(
  "/add-inventory",
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
)

// Add inventory (POST) - protected
router.post(
  "/add",
  utilities.checkAccountType, 
  invValidate.inventoryRules(),
  invValidate.checkAddInventory,
  utilities.handleErrors(invController.addInventory)
)

// JSON route for AJAX inventory loading (protected)
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Edit inventory item view (protected)
router.get(
  "/edit/:invId",
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildEditInventory)
)

// Update Inventory Item (protected)
router.post(
  "/update",
  utilities.checkAccountType, 
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete confirmation page (protected)
router.get(
  "/delete/:invId",
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildDeleteInventory)
)

// Process the deletion (protected)
router.post(
  "/delete",
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
