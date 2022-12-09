const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new mongoose.Schema({

    username: {type: String, required: true, min: 7, max: 20},
    password: {type: String, required: true, min: 5, max: 20}, 
    confirm_password: {type: String, required: true, min: 5, max: 20}, 
    email: {type: String, required: true},
    user_type: {type: String, required: false},
    name: {type: String, required: false},
    bio: {type: String, required: false},
    phone_no: {type: String, required: false},   
    qualifs: {type: [String], required: false},
    address: {type: String, required: false},
    twitter: {type: String, required: false},
    instagram: {type: String, required: false},
    facebook: {type: String, required: false},
    profpic: {type: String, default: "defaultPic.png"},
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentModel',
    }]
    
});

const User = mongoose.model("User", usersSchema);
module.exports = User;