const Editor = require('../models/editorModel')
const Requests = require('../models/requestModel')
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

//google se login
const googlelogin = async(req, res)=>{
  try {
    
    const {username,email,image} = req.body;
  
    const editor = await Editor.findOne({email})
  
    if(editor){
      res.status(200).json(editor)
    }else{
      try {
        const editor = await Editor.signup(username,email,username,image)

         // create a token
        const token = createToken(editor._id);
        const id = editor._id;
        const editors = editor.editors;
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
        const { editorId } = req.params;
        const {username,editorname} = req.body;
      
        try {
          // Find the editor by ID and update its clients array
          const updatedEditor = await Editor.findByIdAndUpdate(
            editorId,
            { $addToSet: { clients: username } }, // Use $addToSet to add the user ID if it doesn't already exist in the array
            { new: true }
          );

          if (!updatedEditor) {
            return res.status(404).json({ error: 'Editor not found' });
          }

          //adding request to db
          const addrequest = await Requests.findOne({ sender: editorname, receiver: username})
          if(addrequest){
            return res.status(400).json({ error: 'request already sent' });
          }
          else{
            const requests = new Requests({ sender: editorname, receiver: username });
            await requests.save();
            return res.status(200).json({requests,msg:"Request is sent successfully",updatedEditor})
          }       
        
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
    addClient,
    googlelogin
  }