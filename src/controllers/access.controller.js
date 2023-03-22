'use strict';

const AccessServices = require('../services/access.service');

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp`, req.body);
      return res.status(201).json(await AccessServices.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
