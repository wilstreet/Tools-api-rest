const path = require ('path');

const{
getAll,
getElemenById,
createElement,
updateElement,
deleteElements,
}=require('../../models/model-firebase');
const COLLECTION_NAME = "allys"

async function getAllys(req,res,next){
    try{
        const allys = await getAll(COLLECTION_NAME);
        return res.json(allys);
    }   catch(err){
        return next(err);
    }
}

async function getAllyById(req,res,next){
    try{
        const ally = await getElemenById(COLLECTION_NAME, req,params.id);
        if (!ally){
            return next (new UsefulError(' The ally no exist!!',404));

        }
        return res.json(ally);
    }catch(err){
        return next(err);
    }
}

async function createAlly(req, res, next) {
    const { firstName, lastName, email} = req.body;
   
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return next(new UsefulError('Incomplete form data', 400));
    }
    try {    
      const newAlly = await createElement(COLLECTION_NAME, {
        firstName,
        lastName,
        email,
        online : false,
      });
      return res.status(201).json(newAlly);
    } catch(err) {
      return next(err);
    }
  }

  async function updateAlly(req,res,next){
    const updateAlly ={};
    for(let prop in req.body){
      if(prop == 'firstname'||prop=='lastName'|| prop =='email'){
        updateAlly[prop]= req.body[prop];
      }
    }
    try{
      await updateElement (COLLECTION_NAME, req.params.id, updatedAlly);
      return res.sendStatus(204);
    }catch (err){
      return next(err);
    }
  }
   async function deleteAlly(req,res,next){
     try{
       await deleteElements(COLLECTION_NAME,req,params.id);
       return res.sendStatus(204);
     }catch(err){
       next(err);
     }
   }
   module.exports={getAllyById,getAllys,createAlly,deleteAlly,updateAlly};
