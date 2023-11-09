const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModel.create({
    inven_productId: shopId,
    inven_shopId: productId,
    inven_location: location,
    inven_stock: stock,
  });
};

module.exports = {
  insertInventory,
};
