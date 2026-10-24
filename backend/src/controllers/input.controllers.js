import inputmodel from "../models/input.models";

const createInput = async(req, res) =>{
    const { name , role } = req.body;

    if(!name || !role){
        return res.json({
            success : false,
            message :"name and role are required"
        })
    }

    const isExist = await inputmodel.findOne({name :{$regex: name.trim(), $option:'i'}})

    if(isExist){
        return res.status(409).json({
            success : false,
            message :"name and role are required"
        })
    }

    const newInput = inputmodel.create({
        name : name.trim(),
        role:role
    })
}