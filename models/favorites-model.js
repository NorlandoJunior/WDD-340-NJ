const pool = require("../database/")

/* **************************************
 * Add favorite (if not exists)
 ************************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* **************************************
 * Remove favorite (if exists)
 ************************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2
      RETURNING *;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* **************************************
 * Check if already favorited
 ************************************** */
async function checkFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT * FROM favorites
      WHERE account_id = $1 AND inv_id = $2;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* **************************************
 * List favorites for user
 ************************************** */
async function getFavoritesByUser(account_id) {
  try {
    const sql = `
      SELECT i.* FROM favorites f
      JOIN inventory i ON i.inv_id = f.inv_id
      WHERE f.account_id = $1;
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesByUser
}
