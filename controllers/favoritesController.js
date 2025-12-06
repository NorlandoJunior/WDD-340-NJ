const favoritesModel = require("../models/favorites-model")

/* **************************************
 * Toggle favorite (AJAX)
 ************************************** */
async function toggleFavorite(req, res) {
  try {
    const inv_id = req.body.inv_id
    const account_id = res.locals.accountData.account_id

    const already = await favoritesModel.checkFavorite(account_id, inv_id)

    if (already) {
      await favoritesModel.removeFavorite(account_id, inv_id)
      return res.json({ success: true, action: "removed" })
    }

    await favoritesModel.addFavorite(account_id, inv_id)
    return res.json({ success: true, action: "added" })

  } catch (error) {
    console.error("Toggle favorite error:", error)
    return res.status(500).json({ success: false })
  }
}

/* **************************************
 * Display user favorites page
 ************************************** */
async function buildFavorites(req, res, next) {
  try {
    let nav = await require("../utilities").getNav()
    const account_id = res.locals.accountData.account_id
    const favorites = await favoritesModel.getFavoritesByUser(account_id)

    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  toggleFavorite,
  buildFavorites
}
