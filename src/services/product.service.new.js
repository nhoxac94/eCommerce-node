// define Factory class to create product

const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothings,
  electronics,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repository/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

class ProductFactory {
  /**
   * type: 'Clothings
   */
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "Electronics":
  //       return new Electronics(payload).createProduct();
  //     case "Clothings":
  //       return new Clothings(payload).createProduct();
  //     default:
  //       throw new BadRequestError('Invalid product Type::', type)
  //   }
  // }

  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError("Invalid product type::", type);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId,  payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError("Invalid product type::", type);
    return new productClass(payload).updateProduct(productId);
  }

  // put
  static async publishProductByShop({ product_shop, product_id }) {
    return publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return unPublishProductByShop({ product_shop, product_id });
  }

  // query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    const a = await findAllDraftsForShop({ query, limit, skip });
    console.log(a);
    return a;
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
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

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  // update
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

// define sub-class for different product types Clothings

class Clothings extends Product {
  async createProduct() {
    const newClothing = await clothings.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) throw new BadRequestError("create new Clothings error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attribute null, undefined

    const objectParams = removeUndefinedObject(this);
    // 2. check where update
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({ productId, 
        bodyUpdate : updateNestedObjectParser(objectParams.product_attributes)
        , model: clothings });
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// define sub-class for different product types Electronics

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic)
      throw new BadRequestError("create new Electronics error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) throw new BadRequestError("create new Furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothings", Clothings);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
