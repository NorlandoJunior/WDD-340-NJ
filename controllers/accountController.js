const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", { 
    title: "Login", 
    nav,
    errors: [],
    account_email: ""
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process registration with server-side validation
* **************************************** */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const errors = []

  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    errors.push("All fields are required")
  }

  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/
  if (account_password && !passwordPattern.test(account_password)) {
    errors.push("Password must be at least 12 chars, contain 1 uppercase, 1 number, and 1 special character")
  }

  if (account_email && await accountModel.checkEmailExists(account_email)) {
    errors.push("Email already in use")
  }

  if (errors.length > 0) {
    return res.status(400).render("account/register", { 
      title: "Register", 
      nav, 
      errors, 
      account_firstname, 
      account_lastname, 
      account_email 
    })
  }

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult && regResult.rowCount > 0) {
    res.status(201).render("account/login", { 
      title: "Login", 
      nav, 
      errors: ["Registration successful! Please log in."],
      account_email: account_email
    })
  } else {
    res.status(500).render("account/register", { 
      title: "Register", 
      nav, 
      errors: ["Registration failed due to server error."],
      account_firstname, 
      account_lastname, 
      account_email 
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }
