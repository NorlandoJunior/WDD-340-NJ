const pool = require("../database/")
const getInventoryById = getVehicleById


/* ================================
 *  Get all classifications
 * ================================ */
async function getClassifications() {
  try {
    const sql = `
      SELECT * 
      FROM public.classification 
      ORDER BY classification_name
    `
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getClassifications error:", error)
    return []
  }
}

/* ================================
 *  Add new classification
 * ================================ */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error:", error)
    return null
  }
}

/* ================================
 *  Get inventory by classification
 * ================================ */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT 
        i.inv_id, i.inv_make, i.inv_model, i.inv_year, 
        i.inv_price, i.inv_image, i.inv_thumbnail, 
        i.inv_description, i.inv_miles, i.inv_color, 
        c.classification_name
      FROM public.inventory AS i 
      JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1
      ORDER BY i.inv_make, i.inv_model;
    `
    const data = await pool.query(sql, [classification_id])
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    return []
  }
}

/* ================================
 *  Get vehicle by ID
 * ================================ */
async function getVehicleById(inv_id) {
  try {
    const sql = `
      SELECT 
        i.*, 
        c.classification_name
      FROM public.inventory i
      JOIN public.classification c
        ON c.classification_id = i.classification_id
      WHERE inv_id = $1;
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error:", error)
    throw error
  }
}

/* ================================
 *  Add new vehicle
 * ================================ */
async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
       inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `
    const params = [
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
    ]

    const result = await pool.query(sql, params)
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"

    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id 
    ])

    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])

    // Retorna 1 se a linha foi afetada, 0 caso contrário
    return data.rowCount
  } catch (error) {
    console.error("Delete Inventory Error: ", error)
    return 0
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventoryItem  
}
