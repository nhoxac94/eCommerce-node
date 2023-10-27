// define Factory class to create product

const { BadRequestError } = require("../core/error.response");
const { product, clothings, electronics } = require("../models/product.model");

class ProductFactory {
  /**
   * type: 'Clothings
   */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Electronics(payload).createProduct();
      case "Clothings":
        return new Clothings(payload).createProduct();
      default:
        throw new BadRequestError('Invalid product Type::', type)
    }
  }
}

// define base product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_prices,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_prices = product_prices;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product

  async createProduct() {
    return await product.create(this);
  }
}

// define sub-class for different product types Clothings

class Clothings extends Product {
  async createProduct() {
    const newClothing = await clothings.create(this.product_attributes);

    if (!newClothing) throw new BadRequestError("create new Clothings error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

// define sub-class for different product types Electronics

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create(this.product_attributes);

    if (!newElectronic)
      throw new BadRequestError("create new Electronics error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

module.exports = ProductFactory;
