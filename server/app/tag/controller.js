const Tag = require('./model');

const store = async (req, res) => {
  try {
    const payload = req.body;
    const newTag = await Tag.create(payload);
    return res.json({
      message: 'New tag added!',
      data: newTag
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
    const tags = await Tag.find().skip(parseInt(skip)).limit(parseInt(limit));
    return res.json({
      message: 'Tags fetched',
      data: tags
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

    const updatedTag = await Tag.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    
    return res.json({
      message: 'Tag updated!',
      data: updatedTag
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
    const tag = await Tag.findByIdAndDelete(id);

    return res.json({
      message: 'Tag deleted!',
      data: tag
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