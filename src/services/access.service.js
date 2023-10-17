const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')

const roleShop = {
  SHOP : 'SHOP',
  WRITER : 'WRITER',
  EDITOR : 'EDITOR',
  ADMIN : 'ADMIN'
}


class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check valid email
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Shop already registered!'
        }
      }

      const passwordHash = bcrypt.hash(password, 10)

      const newShop = await shopModel.create({
        name, email, password : passwordHash, roles : [roleShop.SHOP]
      })
    } catch (error) {
      return {
        code: "error",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
