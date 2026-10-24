import mongoose from "mongoose"

const inputSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    role:{
        type:String,
        required:true,
        enum:['user', 'seller'],
        default:'user'
    }
}, {timestamps : true})

const inputmodel = mongoose.model("input", inputSchema)

export default inputmodel;