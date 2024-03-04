import { ApiFeatures } from "../../../../utils/apiFeatures.js";
import { AppError, catchAsyncError } from "../../../../utils/error.handler.js";
import productModel from "../models/product.model.js";
import reviewModel from "../models/review.model.js";

export const getReviews = catchAsyncError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);
  const apiFeatures = new ApiFeatures(
    reviewModel.findOne({
      product_id: product._id,
    }),
    req.query
  ).paginate(10);
  const reviews = await apiFeatures.query;
  res.json({ reviews });
});
export const addReview = catchAsyncError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);
  const getReview = await reviewModel.findOne({
    product_id: product._id,
    created_by: req.user._id,
  });
  if (getReview) throw new AppError("review already exists", 400);
  const review = await reviewModel.create({
    ...req.body,
    product_id: product._id,
    created_by: req.user._id,
  });
  res.status(201).json({ review });
});
export const updateReview = catchAsyncError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);
  const review = await reviewModel.findByIdAndUpdate(
    { product_id: product._id, created_by: req.user._id },
    req.body,
    { new: true }
  );
  if (!review) throw new AppError("review not found", 404);
  res.json({ review });
});

export const deleteReview = catchAsyncError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);
  const review = await reviewModel.findByIdAndDelete({
    product_id: product._id,
    created_by: req.user._id,
  });
  res.json({ review });
});
