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

// Update Account View
router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process Update Account
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Update Password View
router.get(
  "/update-password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdatePassword)
)

// Process Password Update
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")  // remove o cookie JWT
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
})


module.exports = router
