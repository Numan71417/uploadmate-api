const User = require('../models/userModel')
const Editor = require('../models/editorModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)
    const username = user.username;
    const image = user.image;
    const creatorId = user.creatorId;
    const id = user._id;
    const editors = user.editors;

    res.status(200).json({username , email,image, creatorId , editors, id, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const googlelogin = async(req, res)=>{
  try {
    
    const {username,email,image} = req.body;
  
    const user = await User.findOne({email})
  
    if(user){
      res.status(200).json(user)
    }else{
      try {
        const user = await User.signup(username,email,username,image)

         // create a token
        const token = createToken(user._id);
        const id = user._id;
        const editors = user.editors;
        // const image = user.image;

        res.status(200).json({username, email, image, token,id,editors})
        
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }

  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {username, email, password,image,creatorId} = req.body

  try {
    const user = await User.signup(username,email, password,image,creatorId)

    // create a token
    const token = createToken(user._id);
    const id = user._id;
    const editors = user.editors;

    res.status(200).json({username, email, image, token,creatorId,id,editors})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}


// Update user by ID
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated user
      runValidators: true, // Run data validation defined in the UserModel
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get user by ID
const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(userId); // Delete the user by ID

    res.status(204).json(user); // Respond with no content (204 status code)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const addEditor = async (req, res) => {
  const { userId, editorId } = req.params;

  try {
    // Find the editor by ID and update its clients array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { editors: editorId } }, // Use $addToSet to add the user ID if it doesn't already exist in the array
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'user not found' });
    }

    // Find the user by ID
    const editor = await Editor.findById(editorId);

    if (!editor) {
      return res.status(404).json({ error: 'editor not found' });
    }

    res.status(200).json(updatedUser);
  
  }catch (e) {
    res.status(422).json({ error: e.message });
  }

}



module.exports = { 
  signupUser, 
  loginUser  , 
  getUser, 
  updateUser,
  getAllUsers , 
  deleteUser,
  addEditor ,
  googlelogin
}