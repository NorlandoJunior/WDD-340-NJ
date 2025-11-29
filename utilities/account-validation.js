const utilities = require("../utilities") // corrigido
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/* ****************************************
 *  Registration Validation Rules
 **************************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkEmailExists(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ****************************************
 *  Check Registration Errors
 **************************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ****************************************
 *  Login Validation Rules
 **************************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .normalizeEmail(),

    body("account_password")
      .notEmpty()
      .withMessage("Please provide a password."),
  ]
}

/* ****************************************
 *  Check Login Validation Errors
 **************************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
  }

  next()
}

/* ****************************************
 *  Update Account Validation Rules
 **************************************** */
validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const exists = await accountModel.checkEmailExists(email)

        // If email exists and it's different from the original email, throw an error
        if (exists && email !== req.body.original_email) {
          throw new Error("Email already in use by another account.")
        }
      })
  ]
}

/* ****************************************
 *  Check update errors
 **************************************** */
validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      original_email: req.body.original_email, // corrigido
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
  }
  next()
}

/* ******* Password Rules ******** */
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[^a-zA-Z0-9]/)
      .withMessage("Password must contain at least one special character."),
  ]
}

/* ************ Check password validation ************** */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/update-password", {
      title: "Change Password",
      nav,
      errors: errors.array(),
      notice: null
    })
  }

  next()
}

module.exports = validate