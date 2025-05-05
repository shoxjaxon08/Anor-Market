    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase: true
        },
        password:{
            type:String,
            required:true
        },
        verified:{
            type:Boolean,
            default:false
        },
        verificationToken:String,
        addresses:[
            {   
                region:String,
                city:String,
                mobileNo:String,
                houseNo:String,
                street:String,
                landmark:String,
                country:String,
                postalCode:String
            }
        ],  
        orders:[
            {type:mongoose.Schema.Types.ObjectId,
            ref:'Order',
            }
        ],
        createdAt:{
            type:Date,
            default:Date.now
        },
        
    },{ timestamps: true })

    const User = mongoose.model('User',userSchema);
    module.exports = User
