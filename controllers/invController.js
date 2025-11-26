const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ===========================================
 * Build Inventory Management View
 * =========================================== */
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null
  })
}

/* ===========================================
 * Build By Classification ID
 * =========================================== */
invController.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: data.length ? `${data[0].classification_name} Vehicles` : "Vehicles",
    nav,
    grid,
    errors: null
  })
}

/* ===========================================
 * Build Vehicle Detail View
 * =========================================== */
invController.buildById = async function (req, res, next) {
  let nav = await utilities.getNav()
  const vehicle_id = req.params.invId

  const data = await invModel.getVehicleById(vehicle_id)
  const detailHTML = utilities.buildVehicleDetailHTML(data)

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    detailHTML,
    errors: null
  })
}

/* ===========================================
 * Build Add Classification
 * =========================================== */
invController.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: data.length ? `${data[0].classification_name} Vehicles` : "Vehicles",
    nav,
    grid,
    errors: null
  })
}


/* ===========================================
 * Process Add Classification
 * =========================================== */
invController.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully!")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name,
      errors: null
    })
  }
}

/* ===========================================
 * Build Add Inventory
 * =========================================== */
invController.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null
  })
}

/* ===========================================
 * Process Add Inventory
 * =========================================== */
invController.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    req.flash("notice", "Vehicle successfully added!")
    res.redirect("/inv/")
  } else {
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Failed to add vehicle.")

    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      ...req.body
    })
  }
}

/* ===========================================
 * Return Inventory JSON
 * =========================================== */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  
  if (invData.length > 0) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ===========================================
 * Build Edit Inventory View
 * =========================================== */
invController.buildEditInventory = async function (req, res, next) {
  const inv_id = req.params.invId
  let nav = await utilities.getNav()

  const vehicleData = await invModel.getVehicleById(inv_id)

  let classificationSelect = await utilities.buildClassificationList(
    vehicleData.classification_id
  )

  res.render("inventory/edit-inventory", {
    title: `Edit ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    classificationSelect,
    errors: null,
    ...vehicleData
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    return res.redirect("/inv/")
  }

  const classificationSelect = await utilities.buildClassificationList(classification_id)
  const itemName = `${inv_make} ${inv_model}`

  req.flash("notice", "Sorry, the update failed.")
  return res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  })
}

module.exports = invController
