const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

// Intialize Route
const router = require('./routes/routes')

// Initialize Databases
const userModel = require('./models/userDB');
const commentModel = require('./models/commentsDB');

// Try modules
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const authUtil = require('./utils/auth');
const userRoutes = require('./routes/userRoutes');
const ObjectID = require('mongodb').ObjectId;

const uri = "mongodb+srv://apdev:apdev00@apdevmodule3.v9zuecf.mongodb.net/co_workbookFINAL?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

passport.use(new Strategy(
    (username, password, done) => {
        userModel.findOne({username}, (err, user) => {
            if(err){
                return done(err);
            }

            if(!user) {
                return done(null, false);   
            }

            if(user.password != authUtil.hashPassword(password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.serializeUser((user,done)=>{
        done(null, user._id);
    });

passport.deserializeUser((id,done) => {
        done(null, {id});
    });

const app = express();

app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
    res.locals.loggedIn = req.isAuthenticated();
    next();
})
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Routes
app.use('/', router); // FRONT PAGE HERE
app.use('/users', userRoutes); // TRY

// Handlebars stuff
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('ifFifth', function (index, options) {
    if(index == 0)
        return options.inverse(this)
    if(index%5 == 0){
       return options.fn(this);
    } else {
       return options.inverse(this);
    }
});

hbs.registerHelper('progressWidth', function (value) {
    return `width:${value}%`
});

hbs.registerHelper('ifEquals', function(var1, var2, options) {
    return (var1 == var2) ? options.fn(this) : options.inverse(this);
});
 
// A switch case from  https://stackoverflow.com/questions/53398408/switch-case-with-default-in-handlebars-js
hbs.registerHelper('switch', function(value, options) {
    this.switch_value = value;
    return options.fn(this);
  });
  
hbs.registerHelper('case', function(value, options) {
if (value == this.switch_value) {
    return options.fn(this);
}
});


// handles login concerns, if a user doesn't exist, a flash message will appear
app.get('/login', (req,res,next) => {
    const messages = req.flash();
    res.render('signup',{messages}); //res.render('login',{messages});
});

app.post('/login', passport.authenticate('local', 
    {failureRedirect: '/login', failureFlash: 'Wrong username or password'}),
    (req,res,next) => {
        res.redirect('/index');
});

// /index goes to profile if user is logged in
app.get('/index', (req,res) => {
    if(!req.isAuthenticated()) {
        res.redirect('/login');
    }
    userModel.findOne({username:"Jon Jones"}, function(err,result){ // * we need the username of logged in user
        if(err){
            console.log(err);
        } else {
            // console.log("Result : ", result); // FIND: result return the whole db, FINDONE: result return collection of {same username}
            
            // res.render('profile', { // profile becomes empty but with data from database
            //     user: result,
            // });
            res.redirect('profile'); // profile shows content in page but cannot be edited
        }
    });
});

// registration first asks for username, email, password, confirm_password (confirm_password is for safe record of password since it is hashed)
// flashes messages as well, post is almost the same as addUser except not the whole user data is added
app.get('/register', (req,res,next) => {
    const messages = req.flash();
    res.render('registration', {messages});
})

app.post('/register', (req,res,next) => {
    const registrationParams = req.body;
    const payload = {
        id: registrationParams.id,
        username: registrationParams.username,
        email: registrationParams.email,
        password: authUtil.hashPassword(registrationParams.password),
        confirm_password: registrationParams.confirm_password,
    };
    userModel.insertMany(payload, (err) => {
        if(err) {
            req.flash('error', 'User account already exists!');
        } else {
            req.flash('success', 'User account was registered successfully!')
        }
    
        res.redirect('/register');
    });
});

// Edit user details
app.get('/editUser', (req,res,next) => {
    const userId = req.params.id; // refers to the unique object id of the collection (primary key of mongo db)

    userModel.findOne({_id:"63916b14ebd03a91f3b5f6cf"}, function(err,result){
        if(err){
            console.log(err);
        } else {
            console.log("Result : ", req.params.id);
            res.render('edit_profile', {
                user: result,
            });
        }
    });
});

// Updates to what was edited
app.post('/updateUserNow', (req,res,next) =>{ // must go to template like user_edit
    if(!req.isAuthenticated()) {
        res.redirect('/login');
    }

    // Update data in DATABASE
    const {name, user_type, bio, email, phone_no, address, qualifs, twitter, instagram, facebook} = req.body;
    const _id = ObjectID(req.session.passport.user);
    const str = req.body.qualifs
    userModel.updateOne({_id}, { $set: {name, user_type, bio, email, phone_no, address, qualifs: str.split(','), twitter, instagram, facebook}},
        (err) =>{
            if(err) {
                res.json(err);
            }
            res.redirect('/index');
    });
});

// Show the NAME of searched jobseeker and his/her qualifications
app.post('/showJobseekerN', (req,res) => {
  
    userModel.findOne({user_type:'jobseeker'}, function(err,result){
        if(err){
            console.log(err);
        } else {
            // console.log("Result jobseeker: ", result.name, result.qual); // FIND: result return the whole db, FINDONE: result return collection of {same username}
            
            res.render('searchResultN', { // profile becomes empty but with data from database
                name: result.name,
                qualifs: result.qualifs
            });
        }
    });
});

// Show the NAME of jobseekers that have the qualifications entered
app.post('/showJobseekerQ', (req,res) => {
  
    userModel.find({user_type:'jobseeker'}, function(err,result){
        if(err){
            console.log(err);
        } else {
            // console.log("Result jobseeker: ", result[0].name); // FIND: result return the whole db, FINDONE: result return collection of {same username}
            
            res.render('searchResultQ', { // profile becomes empty but with data from database
                user: result
            });
        }
    });
});

app.get('/logout', (req,res,next) => {
    req.session.destroy();
    res.redirect('/login');
});

app.use(function(req,res,next){
    USER = req.user;
    next();
})

// Comments
app.post('/profile/addComment', (req,res) => {
    console.log(req.body.comment);

    const comment = new commentModel({
        name: 'Jon Jones',
        content: req.body.content,
        // profpic: req.body.profpic
    });
    comment.save((err,result) => {
        if(err){    
            console.log(err)
        }else {
            // console.log('RESULT: ', req.params.id)
            userModel.findById("63916b14ebd03a91f3b5f6cf", (err, user)=>{
                if(err){
                    console.log(err);
                }else {
                    user.comment.push(result);
                    user.save();
                    
                    console.log('====== COMMENTS =====')
                    console.log(user.comment);

                }
            });     
        }
        res.redirect('/profile')
    });
    
});

var server = app.listen(3000, function() {
    console.log("node server runing port 3000...");
});
