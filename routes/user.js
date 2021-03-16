const express=require('express'),
      router=express.Router();
const {userById,allUser}=require('../controllers/user');
const {requireSignin}=require('../controllers/auth');



router.get('/users',allUser);

router.param("userId",userById);


module.exports=router;