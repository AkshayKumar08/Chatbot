const express = require('express')
const router = express.Router()

//home page
router.get(['/', '/home'], (req, res) => {
    res.send('<h1>Welcome</h1>');
})

module.exports = router
