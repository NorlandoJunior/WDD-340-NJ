const utilities = require("../utilities")

const accountController = {}

/* ****************************************
 *  Build My Account view
 * **************************************** */
accountController.buildAccount = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/index", {
      title: "My Account",
      nav,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = accountController

