import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  search,
  address, 
  updateEmployee,
  createEmployee ,
  uploadImage
  
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test/:userId', test);
router.put('/update/:userId', verifyToken, updateUser);
router.put('/empupdate/:userId', verifyToken, updateEmployee);

router.post('/createEmployee',verifyToken, createEmployee)
router.post('/uploadImage/:userId',uploadImage)

router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);
router.get('/search/:q',search);
router.post('/address',verifyToken,address)


export default router;
