const Editor = require('../models/editorModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a editor
const loginEditor = async (req, res) => {
  const {email, password} = req.body

  try {
    const editor = await Editor.login(email, password)

    // create a token
    const token = createToken(editor._id)
    const username = editor.username;
    const image = editor.image;
    const clients = editor.clients;
    const id = editor._id;

    res.status(200).json({username , email,image ,id,token,clients})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a editor
const signupEditor = async (req, res) => {
  const {username, email, password,image,creatorId} = req.body

  try {
    const editor = await Editor.signup(username,email, password,image)

    // create a token
    const token = createToken(editor._id)
    const id = editor._id;
    const clients = editor.clients;

    res.status(200).json({username, email, image,id,clients, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}




// Get editor by ID
const getEditor = async (req, res) => {
  const editorId = req.params.id;

  try {
    const editor = await Editor.findById(editorId);
    if (!editor) {
      return res.status(404).json({ error: 'editor not found' });
    }

    // Return editor data
    res.status(200).json(editor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all editors
const getAllEditors = async (req, res) => {
  try {
    const editors = await Editor.find({});
    res.status(200).json(editors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteEditor = async (req, res) => {
  const editorId = req.params.id;

  try {
    const editor = await Editor.findById(editorId);

    if (!editor) {
      return res.status(404).json({ error: 'editor not found' });
    }

    await editor.findByIdAndDelete(editorId); // Delete the editor by ID

    res.status(204).json(editor); // Respond with no content (204 status code)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update editor by ID
const updateEditor = async (req, res) => {
    const editorId = req.params.id;
    const updateData = req.body;
  
    try {
      const updatededitor = await Editor.findByIdAndUpdate(editorId, updateData, {
        new: true, // Return the updated editor
        runValidators: true, // Run data validation defined in the editorModel
      });
  
      if (!updatededitor) {
        return res.status(404).json({ error: 'editor not found' });
      }
  
      // Return the updated editor data
      res.status(200).json(updatededitor);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


//   const addClient = async (req, res) => {
//     const editorId = req.params.id;
  
//     try {
//       const editor = await Editor.findByIdAndUpdate(
//         editorId,
//         { $push: { clients: req.body._id } },
//         { new: true }
//       );
  
//       if (!editor) {
//         return res.status(404).json({ error: 'Editor not found' });
//       }
  
//       res.status(200).json(editor);
//     } catch (e) {
//       res.status(422).json({ error: e.message });
//     }
//   };


const addClient = async (req, res) => {
        const { editorId, userId } = req.params;
      
        try {
          // Find the editor by ID and update its clients array
          const updatedEditor = await Editor.findByIdAndUpdate(
            editorId,
            { $addToSet: { clients: userId } }, // Use $addToSet to add the user ID if it doesn't already exist in the array
            { new: true }
          );
      
          if (!updatedEditor) {
            return res.status(404).json({ error: 'Editor not found' });
          }
      
          // Find the user by ID
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json(updatedEditor);
        
        }catch (e) {
          res.status(422).json({ error: e.message });
        }

}
  


module.exports = { 
    signupEditor, 
    loginEditor  , 
    getEditor, 
    updateEditor,
    getAllEditors , 
    deleteEditor,
    addClient }