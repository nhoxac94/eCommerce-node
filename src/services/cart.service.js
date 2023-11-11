/**
 * Cart services
 * 1 - add product to cart (user)
 * 2 - reduce product quantity (user)
 * 3 - increase product quantity (user)
 * 4 - get cart (user)
 * 5 - delete cart (user)
 * 6 - delete item in cart (user)
 */

const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repository/product.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      option = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, option);
  }

  static async updateCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      option = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, option);
  }

  static async addToCart({ userId, product = {} }) {
    // check cart exist?
    const userCart = await cartModel.findOne({ cart_userId: userId });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    // gio hang chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return userCart.save();
    }

    // update quantity neu gio hang chua san pham
    return await CartService.updateCartQuantity({ userId, product });
  }

  // update cart
  /**
   * shop_order_ids :[
   *    shopId,
   *    item_products:[
   *      quantity,
   *      price,
   *      shopId,
   *      old_quantity,
   *      productId
   *   ],
   *    version
   * ]
   */

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("");

    console.log(foundProduct)

    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity == 0) {
      // deleted
    }

    return await CartService.updateCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
    updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    const deleteCart = await cartModel.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: userId,
      })
      .lean();
  }
}

module.exports = CartService;
