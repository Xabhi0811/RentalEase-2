 const mongoose = require('mongoose')
 const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


 const AdminSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters long'],
    
  },

  email:{
   type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters'],
  },
password:{
  type: String,
    required: true,
    select: false,
} ,
socketID: {
    type: String,
    default: null,
  },

   

 })

 
 AdminSchema.methods.generateAuthToken = function(){
     const token = jwt.sign(
         {_id: this._id},
         process.env.JWT_SECRET,
         {expiresIn: "24"}
     )
     return token
    }
 
 
    AdminSchema.method.comparePassword = async  function(password){
      return await bcrypt.compare(password , this.password)
    }
 
    AdminSchema.statics.hashPassword = async function (password){
     return await bcrypt.hash(password, 10)
    }
 
    const adminModel = mongoose.model('admin', AdminSchema)
    module.exports = adminModel;
    
 