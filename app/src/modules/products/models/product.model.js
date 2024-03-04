import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: 3,
      maxLength: 200,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 200,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      minLength: 3,
      maxLength: 10000,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      min: 0,
      required: true,
    },
    price: {
      type: Number,
      min: 0.01,
      required: true,
    },
    discounted_price: {
      type: Number,
      min: 0.01,
      required: true,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "The discounted price must not exceed the initial price",
      },
    },
    cover_image: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "image",
    },
    features: [
      {
        key: String,
        value: String,
      },
    ],
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

productSchema.pre("updateMany", function (next) {
  if (this._update.title)
    this._update.slug = slugify(this._update.title, { lower: true });
  next();
});

productSchema.virtual("images", {
  ref: "imageOnProduct",
  localField: "_id",
  foreignField: "product_id",
});

productSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product_id",
});

productSchema.pre(/find/, function (next) {
  this.populate("subcategory_id", "name");
  this.populate("cover_image", "path");
  this.populate("images", ["image_id", "-product_id"]);
  this.populate("reviews", ["text",'reating', "-product_id"]);
  next();
});

productSchema.pre(/delete/i, async function (next) {
  const deletedProduct = await productModel.findOne(this._conditions);
  if (!deletedProduct) return next();
  // delete cover image
  await mongoose
  .model("image")
  .findByIdAndDelete(deletedProduct.cover_image._id);
  // delete images
  await Promise.all(
    deletedProduct.images.map(async (image) => {
      await mongoose.model("imageOnProduct").findByIdAndDelete(image._id);
    })
    );
    // delete reviews
  await Promise.all(
    deletedProduct.reviews.map(async (review) => {
      await mongoose.model("review").findByIdAndDelete(review._id);
    })
  );
  next();
});

productSchema.pre(/update/i, async function (next) {
	if (!this._update.cover_image) return next()
  const updatedProduct = await productModel.findOne(this._conditions);
  if (!updatedProduct) return next();
  await mongoose
    .model("image")
    .findByIdAndDelete(updatedProduct.cover_image._id);
  next();
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
