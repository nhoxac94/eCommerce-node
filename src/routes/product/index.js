const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");

const router = express.Router();


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.getAllProduct))
router.get('/:product_id', asyncHandler(productController.getProduct))


// authentication 
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/published/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublished/:id', asyncHandler(productController.unPublishProductByShop))




// QUERY
/**
 * @desc Get all Draft for shop
 * @param {Number} limit
 * @return {JSON}
 */

router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router
