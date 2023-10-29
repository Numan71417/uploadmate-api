const express = require('express')

// controller functions
const {
    getAllRequests
} = require('../controllers/requestController')

const router = express.Router()

// request route
router.get('/requests', getAllRequests)


module.exports = router