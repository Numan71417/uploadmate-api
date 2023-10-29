const mongoose = require('mongoose')
const {Schema} = mongoose

const RequestSchema = new Schema({
    sender: { 
        type: String, 
        
    },
    receiver: {
        type: String, 
       
    },

    status: {
        type: String,
        default: 'pending',
    }
})

const Requests = new mongoose.model('Requests', RequestSchema)

module.exports = Requests;