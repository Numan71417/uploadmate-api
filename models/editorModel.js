const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const editorSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
        
  image: {
      type:String,
      required:false
  },

  clients: [
    {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
    },
  ]

},{ timestamps: true })

// static signup method
editorSchema.statics.signup = async function(username ,email, password ,image) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  // if (!validator.isEmail(email)) {
  //   throw Error('Email not valid')
  // }
  // if (!validator.isStrongPassword(password)) {
  //   throw Error('Password not strong enough')
  // }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const editor = await this.create({ username ,email, password: hash ,image})

  return editor
}

// static login method
editorSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const editor = await this.findOne({ email })
  if (!editor) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, editor.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return editor
}

module.exports = mongoose.model('Editor', editorSchema)