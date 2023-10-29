const mongoose = require('mongoose')
const {Schema} = mongoose

const VideoSchema = new Schema({
    username: { 
        type: String, 
    },

    editorname: { 
        type: String, 
    },

    title: {
        type: String,     
    },

    description: {
        type: String,     
    },

    videourl: {
        type: String,     
    },

    status: {
        type: String,
        default: 'pending',
    }
})

const Videos = new mongoose.model('Videos', VideoSchema)

module.exports = Videos;