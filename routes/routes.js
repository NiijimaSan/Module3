const express = require("express");
const router = express.Router();

const controller = require("../controllers/controller")
const userController = require('../controllers/user_controller')
const upload = require('../middleware/upload')

// User routes
router.get('/', userController.indexUser)
router.post('/showUser', userController.showUser)
router.post('/storeUser', upload.single('profpic'), userController.storeUser)
router.post('/updateUser', userController.updateUser)
router.post('/deleteUser', userController.deleteUser)

// can change to post calls if need
// router.get('/', controller.signup);
router.get('/home', controller.home);
router.get('/profile', controller.profile);
// router.get('/qualification', controller.qualification);
// router.get('/signup', controller.signup);
// router.get('/registration', controller.registration);
router.get('/searchJob', controller.searchJob);



module.exports = router;