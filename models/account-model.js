const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

async function checkEmailExists(account_email) {
  const sql = "SELECT account_email FROM account WHERE account_email = $1"
  const result = await pool.query(sql, [account_email])
  return result.rowCount > 0
}



module.exports = {
  registerAccount,
  checkEmailExists
}