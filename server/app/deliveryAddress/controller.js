const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');
const DeliveryAddress = require('./model');

const store = async (req, res) => {
  try {
    const payload = req.body;
    const user = req.user;

    const address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.json({
      message: 'Delivery address added!',
      data: address
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

const index = async (req, res) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const count = await DeliveryAddress.find({ user: req.user._id }).countDocuments();
    const address = await DeliveryAddress
      .find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort('-createdAt');
      
    return res.json({
      count,
      message: 'Data fetched!',
      data: address
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

const update = async (req, res) => {
  try {
    const { _id, ...payload } = req.body;
    const { id } = req.params;
    const address = await DeliveryAddress.findById(id);
    const subjectAddress = subject('DeliveryAddress', { ...address, user_id: address.user });
    const policy = policyFor(req.user);
    if(policy.can('update', subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to modify this resource`
      });
    };
    address = await DeliveryAddress.findByIdAndUpdate(id, payload, { new: true });
    res.json({
      message: 'Updated successfully!',
      data: address
    });
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.fields
      });
    };
  };
};

const destroy = async (req,res) => {
  try {
    const { id } = req.params;
    const address = await DeliveryAddress.findById(id);
    const subjectAddress = subject('DeliveryAddress', { ...address, user_id: address.user });
    const policy = policyFor(req.user);
    if(!policy.can('delete', subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to delete this resource.`
      });
    };
    address = await DeliveryAddress.findByIdAndDelete(id);
    return res.json({ message: 'Deleted successfully!' });
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
  store,
  index,
  update,
  destroy
};