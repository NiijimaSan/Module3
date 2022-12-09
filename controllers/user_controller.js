const User = require("../models/userDB")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// Showing list of users
const indexUser = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error has occured!'
        })
    })
}

const showUser = (req, res, next) => {
    let userID = req.body.userID
    User.findById(userID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error has occured!'
        })
    })
}

// Adding new user
const storeUser = (req,res,next) => {
    var str = req.body.qualifs; // body parser was stored in str
    let user = new User({
        username: req.body.username,
        password: req.body.password, 
        name: req.body.name,
        user_type: req.body.user_type,
        bio: req.body.bio,
        email: req.body.email,
        phone_no: req.body.phone_no,
        address: req.body.address,  
        qualifs: str.split(','),
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
    })
    if(req.file){
        user.profpic = req.file.path
    }
    user.save()
    .then(response => {
        res.json({
            message: 'User has been added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error has occured!'
        })
    })
}

// Editing/Updating a user
const updateUser = (req,res,next) => {
    let userID = req.body.userID
    let str = req.body.qualifs
    // let strSplit = str.toString().split(',');

    let updateData = {
        username: req.body.username,
        password: req.body.password, 
        name: req.body.name,
        user_type: req.body.user_type,
        bio: req.body.bio,
        email: req.body.email,
        phone_no: req.body.phone_no,
        address: req.body.address,  
        qualifs: str,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
    }
    if(req.file){
        profpic = req.file.path
    }

    User.findByIdAndUpdate(userID, {$set: updateData})
    .then(() => {
        res.json({
            message: 'User has been updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error has occured!'
        })
    })
}

// Delete user
const deleteUser = (req,res,next) => {
    let userID = req.body.userID
    User.findByIdAndRemove(userID)
    .then(() =>{
        req.json({
            message: 'User has been deleted successfully!'
        })
    })
    .catch(error => {
        req.json({
            message: 'An error has occured!'
        })
    })
}

module.exports = {indexUser, showUser, storeUser, updateUser, deleteUser } // login, register
