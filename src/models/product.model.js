const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      default: true,
    },
    product_description: {
      type: String,
    },
    product_prices: {
      type: String,
      require: true,
    },
    product_quantity: {
      type: Number,
      require: true,
    },
    product_type: {
      type: String,
      require: true,
      enum:['Electronics', 'Clothings', 'Furniture']
    },
    product_shop: {
      type: {type: Schema.Types.ObjectId, ref: 'Shop'},
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define the product type clothings

const clothingsSchema = new Schema({
  brand : {type : String, require : true},
  size : String,
  material : String,
},
  {
    collection : 'clothes',
    timestamps: true
  }
)

const electronicsSchema = new Schema({
  manufactory : {type : String, require : true},
  model : String,
  color : String,
},
  {
    collection : 'electronics',
    timestamps: true
  }
)


//Export the model
module.exports = {
  product : model(DOCUMENT_NAME, productSchema),
  clothings : model('Clothings', clothingsSchema),
  electronics : model('Electronics', electronicsSchema),

}
