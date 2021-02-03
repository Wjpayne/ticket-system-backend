const express = require("express")
const router = express.Router()

router.all('/', (req, res, next) => {
    res.json({ message: "return ticket" })
})

module.exports = router;