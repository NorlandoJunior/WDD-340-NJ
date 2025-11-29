const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 *  Deliver Login View
 * ************************ */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", { 
    title: "Login", 
    nav,
    errors: [],
    account_email: ""
  })
}

/* ************************
 *  Deliver Registration View
 * ************************ */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ************************
 *  Process Registration
 * ************************ */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const errors = []

  // Basic validation
  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    errors.push("All fields are required")
  }

  // Password validation
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/
  if (account_password && !passwordPattern.test(account_password)) {
    errors.push("Password must be at least 12 chars, contain 1 uppercase, 1 number, and 1 special character")
  }

  // Email check
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

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
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
      account_email
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

/* ************************
 *  Process Login Request
 * ************************ */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      )

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000
      })

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

/* ************************
 *  Account Management Page
 * ************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    errors: null
  })
}

/* ************************
 *  Update Account View
 * ************************ */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

/* ************************
 *  Process Account Update
 * ************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const { account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    return res.redirect("/account/")
  }

  req.flash("notice", "Update failed. Try again.")
  return res.status(400).render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email
  })
}

/* ************************
 *  Update password view
 * ************************ */
async function buildUpdatePassword(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update-password", {
    title: "Change Password",
    nav,
    notice: req.flash("notice"),
    errors: null
  })
}

/* ************************
 *  Process password update
 * ************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password } = req.body
  const account_id = res.locals.accountData.account_id

  let hashedPassword = await bcrypt.hash(account_password, 10)

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    return res.status(501).render("account/update-password", {
      title: "Change Password",
      nav,
      errors: null
    })
  }
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount,
  accountLogin,
  buildAccountManagement,
  updateAccount,
  buildUpdateAccount,
  buildUpdatePassword,
  updatePassword
}
