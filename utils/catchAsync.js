module.exports = asyncFunc => {
    return function(req, res, next){
        asyncFunc(req, res, next).catch(next)
    }
}
// By default any errors that are caught by .catch() are automatically passed to the callback function that we pass to .catch(), which is the next function in this case. Which will then cause the error to go to our custom error handeler in our app.