const errorController = {}

/***************************
 * * Throw Error Function *
 ***************************/
errorController.throwError = (req, res, next) => {
  const err = new Error("Intentional Server Error")
  err.status = 500
  next(err)
}

module.exports = errorController
