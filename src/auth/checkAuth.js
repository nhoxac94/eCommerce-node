'use strict';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const { findById } = require('../services/apikey.service');

const apiKey = async (req, res, next) => {
  try {
    const key = req.header[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    // check objectkey

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'permission denied',
      });
    }

    console.log('permission::', req.objKey.permissions);
    const validPermission = req.objKey.includes(permission);

    if (!validPermission) {
      if (!req.objKey.permissions) {
        return res.status(403).json({
          message: 'permission denied',
        });
      }
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};