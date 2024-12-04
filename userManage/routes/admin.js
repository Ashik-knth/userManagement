const express = require('express');
const admin_router = express();
const adminController = require('../Controller/adminController');
const admin_auth = require('../middleware/adminauth');


admin_router.get('/login',admin_auth.isLogin,adminController.adminlogin)

admin_router.post('/login',adminController.adminloginpost);

admin_router.get('/dashboard',admin_auth.checksession,adminController.admindashboard);

admin_router.post('/edit-user',adminController.edituser);

admin_router.post('/create-user',adminController.createuser);

admin_router.delete('/delete-user/:id',adminController.deleteuser);

admin_router.post('/search',adminController.search);

admin_router.get('/logoutadmin',adminController.logout);











module.exports = admin_router;