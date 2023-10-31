
const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service.new");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message : 'Create new Product success',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  // PUT
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message : 'Publish product success',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id : req.params.id
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message : 'Publish product success',
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id : req.params.id
      })
    }).send(res)
  }
  // QUERY
   
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message : 'Get list Draft success',
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message : 'Get list Published success',
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message : 'Get list Search Product success',
      metadata: await ProductFactory.getListSearchProduct(
        req.params
      )
    }).send(res)
  }
  // END QUERY
}

module.exports = new ProductController()