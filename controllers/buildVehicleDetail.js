const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ***************************
 *  Build vehicle detail view
 * ************************** */
module.exports = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getVehicleByInvId(inv_id)

    if (!data || data.length === 0) {
      // No vehicle found
      const nav = await utilities.getNav()
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, the requested vehicle could not be found.",
      })
    }

    const vehicle = data[0]
    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    })
  } catch (error) {
    console.error("buildVehicleDetail error:", error)
    next(error)
  }
}
