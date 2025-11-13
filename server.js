/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")

/* View Engine and Templates */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); 

/* ***********************
 * Routes
 *************************/
app.use(express.static("public"))
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory route
app.use("/inv", inventoryRoute);
//Error Route
app.use("/error", require("./routes/errorRoute"))
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  // 404 handler
  if (err.status == 404) {
    return res.status(404).render("errors/error", {
      title: "404 - Not Found",
      message: err.message,
      nav
    })
  }

  // All other errors → 500
  return res.status(500).render("errors/500", {
    title: "500 - Server Error",
    message: err.message,
    nav
  })
})



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
