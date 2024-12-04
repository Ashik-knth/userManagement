const express = require('express');
const user_router = express();
const userController = require('../Controller/userController');
const auth = require('../middleware/auth');


user_router.get('/userhome', auth.checksession,userController.userHome);
user_router.get('/',auth.checksessionLogin,userController.userlogin)
user_router.post('/',userController.login);

user_router.get('/register',auth.checksessionLogin, userController.userregister)

user_router.post('/register',userController.registerUser);

user_router.get('/logout',userController.logout);

// user_router.get('/getAllusers',userController.alldata)

user_router.put('/update/:id',userController.updatedata);

user_router.delete('/delete/:id',userController.deletedata);






module.exports = user_router;

