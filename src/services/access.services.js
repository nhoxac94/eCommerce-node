const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.services');
const { createTokenPair } = require('../auth/authUtils');
const { getIntoData } = require('../utils/index');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessServices {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'shop already registered!',
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: RoleShop.SHOP,
      });

      if (newShop) {
        //create privateKey, publickey
        const privateKey = crypto.getRandomValues(64).toString('hex')
        const publicKey = crypto.getRandomValues(64).toString('hex')

        console.log({ privateKey, publicKey });

        const keyStores = await KeyTokenService.createKeyToken({
          userId : newShop._id,
          publicKey,
          privateKey
        })

        if(!keyStores) {
          return {
            code: 'xxx',
            message: 'KeyStores error!',
          }; 
        }

        // create token pair
        const tokens = await createTokenPair({
          userId: newShop._id, email
        }, publicKey, privateKey )
        console.log('Create Token Success::', tokens)

        return {
          code: 201,
          metadata : {
            shop: getIntoData( {fields : ['_id', 'name', 'email'] , object : newShop}),
            tokens
          }
        }
      }

      return {
        code : 200,
        metadata: null
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
