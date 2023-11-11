/**
 * Discount service
 * 1 - generate code [admin | shop]
 * 2 - get discount amount [user]
 * 3 - get all discount codes [user | shop]
 * 4 - verify discount code [user]
 * 5 - Delete discount code [amin | shop]
 * 6 - cancel discount code [user]
 */

const {
  checkDiscountExists,
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
} = require("../models/repository/discount.repo");
const { findAllProducts } = require("../models/repository/product.repo");

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");

class DiscountServices {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order,
      product_ids,
      applies_to,
      users_used,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // check input
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expired!");
    // }

    if (new Date(start_date) >= new Date() > new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    //create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount) {
      throw new BadRequestError("Discount code existed!");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_is_active: code,
      discount_value: value,
      discount_min_order_value: min_order || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /**
   * Get all discount codes available with products
   */

  static async getAllProductsWithDiscountCodes({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount_code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exist!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "cline",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "cline",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesWithProduct() {}

  static async getAllDiscountCodesByShopId(limit, page, shopId) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ["discount_code", "discount_name"],
      model: discountModel,
    });

    return discounts;
  }

  /**
   * Apply discount codes
   */

  static async getDiscountAmount({ codeId, userId, shopId, productId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount not exist");
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_value,
      discount_type,
      discount_start_date,
      discount_end_date
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount expired");
    if (!discount_max_uses) throw new NotFoundError("Discount are out!");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount expired");
    }

    let totalOrder;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount requires a minimum order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUseDiscount) {
      }
    }

    // check xem discount fixed amount or percent
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return { totalOrder, discount: amount, totalPrice: totalOrder - amount };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_productId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount not exist");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountServices;
