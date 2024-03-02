import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  console.log('this is the test fun')
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isPerson === 'admin' && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isPerson === 'admin' || !req.user.isPerson === 'supervisor') {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};  
export const uploadImage = async(req,res,next) =>{
  console.log('this is the user image upload function')
  const {image} = req.body
  console.log(image,'this is the image url')
  const userId = req.params.userId;
  try{
    const data = await User.findById(userId)
    data.profilePicture = image
    const validUser = await data.save()
    console.log(validUser)
    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json(rest)

  }catch(error){
    next(error)
  }
}
export const getUser = async (req, res, next) => {
  try {
    console.log('This is the getuser function')
    console.log(req.params.userId)

    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async(req,res,next)=>{
  console.log('this is the create employee function');
  console.log(req.body);
  const { username, email, password ,role } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !role ||
    username === '' ||
    email === '' ||
    password === '' ||
    role === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const validUser = await User.findOne({email})

  if(validUser){
    next(errorHandler(400, 'Email already exists'));
  }
  const newUser = new User({
    username,
    email,
    isPerson:role,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('user created successful');
  } catch (error) {
    next(error);
  }
}


export const search = async (req, res, next) => {
  console.log('this is the search');
  const query = req.params.q;
  console.log(query);
  try {
    let postData;
    if (query) {
      console.log('Searching...');
      postData = await User.find({
        $or: [
          { username: new RegExp(query, 'i') },
          { email: new RegExp(query, 'i') },
          {isPerson: new RegExp(query, 'i') },
          { 'address.city': new RegExp(query, 'i') },
          { 'address.state': new RegExp(query, 'i') },
        ]
      });
      console.log('Search completed.');
      console.log('Found data:', postData);
    } else {
      postData = await User.find({});
    }

    return res.status(200).json(postData);
  } catch (error) {
    console.error('Error during search:', error);
    next(error);
  }
};


export const updateEmployee = async (req, res, next) =>{
  console.log('this is the update function');

  if (!req.user.isPerson === 'admin') {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 10) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
    try {
      console.log('this is try block')
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            isPerson:req.body.role,
            password: req.body.password,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }

}
  export const address = async (req, res, next) => {
    const userId = req.user.id;
    const { city, state, mobile } = req.body;

    if (!city || !state || !mobile) {
      return next(errorHandler(400, 'Please enter all fields'));
    }

    try {
      const userData = await User.findById(userId);
      const userAddress = userData.address;
      if (userAddress) {
        return next(errorHandler(400, 'Address already exists'));
      }
      if (userAddress.mobile === mobile) {
        return next(errorHandler(400, 'Mobile already exists'));
      }
      userData.address.push({
        userId,
        city,
        state,
        mobile
      });


      const address = await userData.save();
      console.log(address)

      res.status(200).json({
        success: true,
        message: 'Address added successfully',
        address: address
      });
    } catch (error) {
      // Handle errors when saving the new address
      return next(errorHandler(500, 'Internal Server Error'));
    }
  };

