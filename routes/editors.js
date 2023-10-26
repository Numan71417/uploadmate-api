const express = require('express')

// controller functions
const { 
    loginEditor, 
    signupEditor ,
    getEditor, 
    updateEditor,
    getAllEditors, 
    deleteEditor,
    addClient
} = require('../controllers/editorController')

const router = express.Router()

// login route
router.post('/login', loginEditor)

// signup route
router.post('/signup', signupEditor)

// update route
router.put('/:id', updateEditor)

// get a single Editor route
router.get('/:id', getEditor)

// delete a single Editor route
router.delete('/:id', deleteEditor)

// get all Editors route
router.get('/', getAllEditors)

// add client route
router.put('/addClient/:editorId/:userId', addClient)

module.exports = router