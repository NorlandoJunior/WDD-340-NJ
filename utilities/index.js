const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })

  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = ""
    data.forEach((vehicle) => {
      grid += `
        <article>
          <img src="${vehicle.inv_thumbnail}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
          <div class="namePrice">
            <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <p>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
            <a href="/inv/detail/${vehicle.inv_id}" class="btn-primary">View Details</a>
          </div>
        </article>
      `
    })
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* **************************************
 * Build the vehicle detail HTML
 * ************************************ */
Util.buildVehicleDetail = function (v) {
  return `
    <!-- LEFT (image) + RIGHT (details) -->
    <img src="${v.inv_image}" 
         alt="${v.inv_make} ${v.inv_model}" />

    <div class="vehicle-details">
      <h2>${v.inv_year} ${v.inv_make} ${v.inv_model}</h2>

      <p class="vehicle-price">
        $${new Intl.NumberFormat("en-US").format(v.inv_price)}
      </p>

      <p><strong>Mileage:</strong> 
        ${new Intl.NumberFormat("en-US").format(v.inv_miles)} miles
      </p>

      <p><strong>Color:</strong> ${v.inv_color}</p>

      <p><strong>Description:</strong> ${v.inv_description}</p>
    </div>
  `
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
