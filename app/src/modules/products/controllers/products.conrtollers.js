import { catchAsyncError } from "../../../../utils/error.handler.js";
import imageModel from "../../image/models/image.model.js";
import { makeImage } from "../../image/utils/image.utils.js";
import imageOnProductModel from "../models/imageOnProduct.js";
import productModel from "../models/product.model.js";

export const addProductWithImages = () =>
  catchAsyncError(async (req, res, next) => {
    const product = await productModel.create({
      ...req.body,
      created_by: req.user._id,
    });
    if (req.files?.images)
      await Promise.all(
        req.files.images.map(async (file) => {
          try {
            const image = await makeImage(file.path);
            await imageOnProductModel.create({
              image_id: image._id,
              product_id: product._id,
            });
          } catch (error) {
            return next(error);
          }
        })
      );
    res.status(201).json({
      message: `added product with ${req.files.images.length} images`,
    });
  });
export const updateProductWithImages = () =>
  catchAsyncError(async (req, res, next) => {
    if (req.files?.images) {
      const product = await productModel.findOne({
        slug: req.params.productSlug,
      });
      await Promise.all(
        product.images.map(async (image) => {
          try {
            await imageOnProductModel.findByIdAndDelete(image._id);
          } catch (error) {
            return next(error);
          }
        })
      );
      await Promise.all(
        req.files.images.map(async (file) => {
          try {
            const image = await makeImage(file.path);
            await imageOnProductModel.create({
              image_id: image._id,
              product_id: product._id,
            });
          } catch (error) {
            return next(error);
          }
        })
      );
    }
    await productModel
      .updateOne({}, req.body)
      .where({ slug: req.params.productSlug });
    res.json({
      message: `updated product with ${req.files.images?.length} images`,
    });
  });
