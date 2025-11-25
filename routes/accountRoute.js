const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Account Management View
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)


 //Login Route
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

//Registration Route
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

//Process Registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


// Process Login Request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


module.exports = router
