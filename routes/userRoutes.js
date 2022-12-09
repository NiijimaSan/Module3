var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectId;
const userModel = require('../models/userDB');

router.get('/', (req,res,next) =>{
    if(!req.isAuthenticated()){
        res.redirect('/auth/login');
    }

    const _id = ObjectID(req.session.passport.user);    
    userModel.findOne({ _id}, (err, results) => {
        if(err){
            throw err;
        }

        res.render('edit_profile', { ...results });
    });
});

router.get('/:username', (req,res,next) => {
    const username = req.params.username;
    // if(!req.isAuthenticated()) { // we need to be authenticated before stalking someone  
    //     res.redirect('/auth/login');
    // }

    userModel.findOne({username}, (err, results) => {
        if(err || !results){
            res.render('profile', {message: { error: ['User not found!']}}); // User stalked not found
        }

        res.render('profile', { ...results, username });
    });
});

router.post('/', (req,res,next) =>{ // must go to template like user_edit
    if(!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }

    // const users = userModel;
    const {name, user_type, bio, email, phone_no, address, qualifs, twitter, instagram, facebook} = req.body;
    const _id = ObjectID(req.session.passport.user);
    userModel.updateOne({_id}, { $set: {name, user_type, bio, email, phone_no, address, qualifs, twitter, instagram, facebook}},
        (err) =>{
            if(err) {
                throw err;
            }
            res.redirect('/users');
    });
});

module.exports = router;