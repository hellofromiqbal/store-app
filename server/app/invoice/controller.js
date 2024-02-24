const { subject } = require('@casl/ability');
const Invoice = require('./model');
const { policyFor } = require('../../utils');

const show = async (req, res) => {
  try {
    const policy = policyFor(req.user);
    const subjectInvoice = subject('Invoice', { ...invoice, user_id: invoice.user._id });
    if(!policy.can('read', subjectInvoice)) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat invoice ini.`
      });
    };

    const { order_id } = req.params;
    const invoice = await Invoice
      .findOne({ order: order_id })
      .populate('order')
      .populate('user');

    return res.json(invoice);
  } catch (err) {
    return res.json({
      error: 1,
      message: `Error when getting invoice...`
    });
  };
};

module.exports = {
  show
};