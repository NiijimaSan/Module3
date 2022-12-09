const User = require("../models/userDB")

const controller = {
    
    home: function (req, res) {
        let user =  User({
            username: req.body.username,
            password: req.body.password, 
            name: req.body.name,
            user_type: req.body.user_type,
            bio: req.body.bio,
            email: req.body.email,
            phone_no: req.body.phone_no,
            address: req.body.address,  
            qualifs: req.body.qualifs,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
            facebook: req.body.facebook,
        })
        if(req.file){
            user.profpic = req.file.path
        }
        res.render('index', {
            
            homepageData: { // Posts
                postArray: [{ // Dummy data for posts since we focus on editing user profile and comments
                    profilePicture: "imgs/working_woman.jpg",
                    username: "cynthium",
                    profileType: "employee.html",
                    name: "Cythia Dahmer",
                    postData: "Wow, its that time of year again! you guys got this!! #jobseekers"
                },
                {
                    profilePicture: "imgs/casual_woman.jpg",
                    username: "hazelsam",
                    profileType: "jobseeker.html",
                    name: "Hazel Cruz",
                    postData: "All of these makes me want to skip through my last year in college!! Just a couple more months!!"
                },
                {
                    profilePicture: "imgs/businessman.jpg",
                    username: "antonsantos",
                    profileType: "recruiter.html",
                    name: "Anthony Santos",
                    postData: "Head's up jobseekers, I'm here again for another round of recruitment at Tech Solution Company. PM is the key!"
                },
                {
                    profilePicture: "imgs/working_woman.jpg",
                    username: "cynthium",
                    profileType: "employee.html",
                    name: "Cythia Dahmer",
                    postData: "Go Jobseekers, hoping for the best! Let's work together someday! :)"
                },
                {
                    profilePicture: "imgs/asian_lady.jpg",
                    username: "lifeofangela",
                    profileType: "jobseeker.html",
                    name: "Angela Gomez",
                    postData: "All of these makes me want to skip through my last year in college!! Just a couple more months!!"
                },
                {
                    profilePicture: "imgs/businessman.jpg",
                    username: "antonsantos",
                    profileType: "recruiter.html",
                    name: "Anthony Santos",
                    postData: "What's up jobseekers, I am Tony Santos. I'm currently recruiting for TechSolution Company! Interested? PM is the key!"
                },
                {
                    profilePicture: "imgs/working_woman.jpg",
                    username: "cynthium",
                    profileType: "employee.html",
                    name: "Cythia Dahmer",
                    postData: "This is my first post in Co-WorkBook, I'm liking it so far.."
                }],
                profilePicture: 'imgs/' + user.profpic 
            }
        });      
    },

    qualification: function(req, res) {
        res.render('qualification')
    },

    signup: function(req, res) {
        res.render('signup');
    },

    registration: function(req, res) {
        res.render('registration');
    },


    searchJob: function(req, res) {
        res.render('searchjobseek')
    },

    profile: function (req, res) { // profile
        User.findOne({username:"JonJones"}, function(err,result){
            if(err){
                console.log(err);
            } else {
                res.render('profile', {
                    profile: {
                        ProfileCard: {
                            name: result.name,
                            job: "UFC Inc. Recruiter Head",
                            jobAddress: "Las Vegas, Nevada",
                            status: "Actively Recruiting",
                            company: "UFC Inc.",
                            profilePicture: "imgs/" + result.profpic
                        },
                        ProfileData: {
                            twitter: result.twitter,
                            instagram: result.instagram,
                            facebook: result.facebook
                        },
                        ProfileHead: {
                            bio: result.bio,
                            email: result.email,
                            phone_no: result.phone_no,
                            address: result.address,
                        },
                        Comments: [
                            {
                                name: result.name,
                                content: "Hi welcome to my page!",
                                profilePicture: "imgs/" + result.profpic
                            },
                            {
                                name: "Joshua Marcus Tan",
                                content: "Hello good sir!",
                                profilePicture: "imgs/asian_man.jpg"
                            },
                            {
                                name: "Anthony Santos",
                                content: "I know you are a recruiter but I think I wanna recruit you LOL!",
                                profilePicture: "imgs/businessman.jpg"
                            },
                            {
                                name: result.name,
                                content: "LOL, you wanna share ideas??",
                                profilePicture: "imgs/" + result.profpic
                            },
                            {
                                name: "Hazel Samantha Cruz",
                                content: "Wow UFC Inc.? May I ask you a few questions?",
                                profilePicture: "imgs/casual_woman.jpg"
                            },
                        ],
                        ProfileType: result.user_type
                        
                    }
                })
              
            }
        });

    },

    
    homepage: function(req, res) {
        res.render('homepage')
    }
    
}
module.exports =  controller;