const User = require('../user/model');
const bcrypt = require('bcrypt');


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

module.exports = {
  register
};