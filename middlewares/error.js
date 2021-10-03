module.exports = (err, req, res, next)=> {
    console.log(err.message);
    return res.status(500).send(err.message || "Something Failed!!!, error.js");
}