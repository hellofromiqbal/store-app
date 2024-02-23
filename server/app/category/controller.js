const Category = require('./model');

const store = async (req, res) => {
  try {
    const payload = req.body;
    const newCategory = await Category.create(payload);
    return res.json({
      message: 'New category added!',
      data: newCategory
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
    const categories = await Category.find().skip(parseInt(skip)).limit(parseInt(limit));
    return res.json({
      message: 'Categories fetched',
      data: categories
    });
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message
    });
  };
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    
    return res.json({
      message: 'Category updated!',
      data: updatedCategory
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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    return res.json({
      message: 'Category deleted!',
      data: category
    });
  } catch (err) {
    return res.json({
      error: 1,
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