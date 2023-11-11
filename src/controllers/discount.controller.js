const { SuccessResponse } = require("../core/success.response");
const { default: DiscountServices } = require("../services/discount.service");


class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message : 'Create new discount success',
      metadata: await DiscountServices.createDiscountCode(req.body.product_type, {
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message : 'Successful get all code',
      metadata: await DiscountServices.getAllDiscountCodesByShopId(req.body.product_type, {
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message : 'Successful get all code',
      metadata: await DiscountServices.getDiscountAmount(req.body.product_type, {
        ...req.body,
      })
    }).send(res)
  }

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message : 'Successful get all code',
      metadata: await DiscountServices.getAllDiscountCodesWithProduct(req.body.product_type, {
        ...req.query,
      })
    }).send(res)
  }
}

module.exports = new DiscountController()