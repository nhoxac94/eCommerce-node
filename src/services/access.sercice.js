'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = required('crypto');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '0001',
  EDITOR: '0001',
  ADMIN: '0000',
};

class AccessServices {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exits
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Shop already register',
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        //created privatekey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          moduluslength: 4096,
        });

        console.log({ privateKey, publicKey }); //save collection Keystore
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessServices;
