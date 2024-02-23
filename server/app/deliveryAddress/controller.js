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
    const addresses = await DeliveryAddress.find();
    return res.json({
      message: 'Delivery addresses fetched!',
      data: addresses
    });
  } catch (err) {
    return res.json({
      message: err.message
    });
  };
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const deliveryAddress = await DeliveryAddress.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return res.json({
      message: 'Delivery address updated!',
      data: deliveryAddress
    })
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
  };
};

const destroy = async (req,res) => {
  try {
    const { id } = req.params;
    const deliveryAddress = await DeliveryAddress.findByIdAndDelete(id);
    
    return res.json({
      message: 'Delivery address deleted successfully!',
      data: deliveryAddress
    });
  } catch (err) {
    return res.json({
      message: err.message
    });
  };
};

module.exports = {
  store,
  index,
  update,
  destroy
};