const Videos = require('../models/videoModel')
const Editor = require('../models/editorModel')
const User = require('../models/userModel')

const addVideo = async(req, res)=>{
    const {editorname,username,title,description,videourl,status} = req.body;

    try {
        const videodata = new Videos({username,editorname,title,description,videourl,status})
        const done = await videodata.save();
        return res.status(200).json({msg:"successfully added to db",done})
    } catch (error) {
        res.status(422).json({ error });
    }
}

const getVideos = async(req,res)=>{
    try{
        const videodata = await Videos.find({});
        return res.status(200).json(videodata);
    }catch (e){
        res.status(404).json({ error });
    }
}

module.exports = {addVideo,getVideos}