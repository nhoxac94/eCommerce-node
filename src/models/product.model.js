const { Schema, model } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

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
    product_slug: {
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
      type: Schema.Types.ObjectId, ref: 'Shop'
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
    // more 
    product_ratingsAverage: {
      type : Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val) => Math.round(val*10) / 10

    },
    product_variation: {
      type : Array,
      default: []
    },
    isDraft : {
      type: Boolean,
      default : true,
      index: true,
      select: false
    },
    isPublished : {
      type: Boolean,
      default : false,
      index: true,
      select: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

// Document middleware: runs before .save() .create() 
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, {lower : true})
  next()
})

// define the product type clothings

const clothingsSchema = new Schema({
  brand : {type : String, require : true},
  size : String,
  material : String,
  product_shop : {type : Schema.Types.ObjectId, ref : "Shop"}
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
  product_shop : {type : Schema.Types.ObjectId, ref : "Shop"}
},
  {
    collection : 'electronics',
    timestamps: true
  }
)

const furnitureSchema = new Schema({
  brand : {type : String, require : true},
  size : String,
  material : String,
  product_shop : {type : Schema.Types.ObjectId, ref : "Shop"}
},
  {
    collection : 'furniture',
    timestamps: true
  }
)



//Export the model
module.exports = {
  product : model(DOCUMENT_NAME, productSchema),
  clothings : model('Clothings', clothingsSchema),
  electronics : model('Electronics', electronicsSchema),
  furniture : model('Furniture', furnitureSchema),

}
