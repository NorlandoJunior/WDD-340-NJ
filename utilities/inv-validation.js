const { body, validationResult } = require("express-validator")
const utilities = require("./")

const invValidate = {}

/* ==========================================
 *   Classification Validation Rules
 * ========================================== */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

/* ==========================================
 *  Check Classification Data
 * ========================================== */
invValidate.checkAddClassification = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
  }
  next()
}

/* ==========================================
 *   Inventory Validation Rules
 * ========================================== */
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty().withMessage("Make is required.")
      .isLength({ min: 2 }).withMessage("Make must be at least 2 characters."),

    body("inv_model")
      .trim()
      .notEmpty().withMessage("Model is required.")
      .isLength({ min: 2 }).withMessage("Model must be at least 2 characters."),

    body("inv_year")
      .trim()
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1900, max: 2100 }).withMessage("Enter a valid year."),

    body("inv_description")
      .trim()
      .notEmpty().withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 }).withMessage("Price must be a valid number."),

    body("inv_miles")
      .trim()
      .notEmpty().withMessage("Miles is required.")
      .isInt({ min: 0 }).withMessage("Miles must be a valid number."),

    body("inv_color")
      .trim()
      .notEmpty().withMessage("Color is required."),

    body("classification_id")
      .notEmpty().withMessage("You must select a classification.")
  ]
}

/* ==========================================
 *  Check Inventory Data
 * ========================================== */
invValidate.checkAddInventory = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    )

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(),
      ...req.body
    })
  }

  next()
}

module.exports = invValidate
