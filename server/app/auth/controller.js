const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');


const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    
    return res.json({
      message: 'New user created successfully!',
      data: newUser
    });
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
  };
};

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
      .select('-__v -createdAt -updatedAt -cart_items -token');

    if(!user) return done();
    if(bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    };
  } catch (err) {
    done(err, null);
  };
  done();
};

const login = async (req, res) => {
  try {
    passport.authenticate('local', async function(err, user) {
      if(err) throw new Error(err);
      if(!user) {
        return res.json({
          error: 1,
          message: 'Invalid email or password!'
        });
      };

      const signed = jwt.sign(user, config.secretKey);

      await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

      return res.json({
        message: 'Logged in successfully!',
        data: user,
        token: signed
      });
    }) (req, res);
  } catch (err) {
    return res.json({
      message: err.message
    });
  };
};

const logout = async (req, res) => {
  try {
    let token = getToken(req);

    if (!token) {
      return res.json({
        error: 1,
        message: 'Token not found in request!'
      });
    }

    // Find the user by the token and remove the token from the array
    let user = await User.findOneAndUpdate(
      { token: token },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );

    // If no user found or token not removed, return an error
    if (!user) {
      return res.json({
        error: 1,
        message: 'User not found or token not removed!'
      });
    }

    return res.json({
      error: 0,
      message: 'Logged out successfully!'
    });
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message
    });
  }
};

module.exports = {
  register,
  localStrategy,
  login,
  logout
};