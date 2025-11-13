const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const result = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return result.rows
  } catch (error) {
    console.error("getClassifications error:", error)
    return []
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT 
        i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_image, 
        i.inv_thumbnail, i.inv_description, i.inv_miles, i.inv_color, 
        c.classification_name
      FROM public.inventory AS i 
      JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    return []
  }
}

/* ***************************
 *  Get vehicle data by inv_id
 * ************************** */
async function getInventoryItemById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name
       FROM inventory i
       JOIN classification c
         ON c.classification_id = i.classification_id
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryItemById error:", error)
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemById
}