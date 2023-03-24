'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'APIkey';
const COLLECTION_NAME = 'Apikeys';

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: ['000', '111', '222'],
    },
  },
  {
    timestamps: true,
    enum: ['000', '111', '222'],
  }
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
