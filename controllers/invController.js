const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      let nav = await utilities.getNav()
      return res.status(404).render("inventory/classification", {
        title: "No vehicles found",
        nav,
        grid: "<p>No vehicles available for this classification.</p>",
      })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    console.error("buildByClassificationId error:", error)
    next(error)
  }
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildById = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryItemById(invId)

    if (!vehicle) {
      let nav = await utilities.getNav()
      return res.status(404).render("inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        vehicle: null,
      })
    }

    const nav = await utilities.getNav()
    const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("inventory/detail", {
      title: vehicleName,
      nav,
      vehicle,
    })
  } catch (error) {
    console.error("buildById error:", error)
    next(error)
  }
}

module.exports = invCont
