const Requests = require('../models/requestModel')
const Editor = require('../models/editorModel')
const User = require('../models/userModel')

// Get all requests
const getAllRequests = async (req, res) => {
    try {
      const reqs = await Requests.find({});
      res.status(200).json(reqs);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


module.exports = {getAllRequests}