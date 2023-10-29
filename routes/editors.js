const express = require('express')

// controller functions
const { 
    loginEditor, 
    signupEditor ,
    getEditor, 
    updateEditor,
    getAllEditors, 
    deleteEditor,
    addClient,
    googlelogin,
} = require('../controllers/editorController')

const router = express.Router()

// login route
router.post('/login', loginEditor)

// signup route
router.post('/signup', signupEditor)

// google se login route
router.post('/googlelogin', googlelogin)

// update route
router.put('/:id', updateEditor)

// get a single Editor route
router.get('/:id', getEditor)

// delete a single Editor route
router.delete('/:id', deleteEditor)

// get all Editors route
router.get('/', getAllEditors)

// add client route
router.put('/addClient/:editorId', addClient)

module.exports = router