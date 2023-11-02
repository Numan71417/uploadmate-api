require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const editorRoutes = require('./routes/editors')
const requestRoutes = require('./routes/requests')
const videoRoutes = require('./routes/videos')
const ytuploadRoutes = require('./ytupload/upload')
const cors = require('cors');

// express app
const app = express()

// middleware
app.use(cors());

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


// routes
app.use('/api/user', userRoutes)
app.use('/api/editor', editorRoutes)
app.use('/api/', requestRoutes)
app.use('/api/', videoRoutes)
app.use('/', ytuploadRoutes)

app.get('/', (req,res)=>{
  res.status(200).json("Every thing is working use endpoints to use api")
})


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })