//Error route
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

router.get("/500", errorController.throwError)

module.exports = router
