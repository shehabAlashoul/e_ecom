import { ApiFeatures } from "../../../../utils/apiFeatures.js";
import { catchAsyncError } from "../../../../utils/error.handler.js";
import categoryModel from "../models/category.model.js";

export const getCategory = catchAsyncError(async (req, res, next) => {
  const { categorySlug } = req.params;
  const categry = await categoryModel.findOne({ slug: categorySlug });
  res.json({ categry });
});
export const getCategores = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query).search([
    "name",
  ]);
  const categres = await apiFeatures.query;
  res.json({ categres });
});
export const addCategory = catchAsyncError(async (req, res) => {
    req.body.created_by = req.user._id
  const categry = await categoryModel.create(req.body);
  res.status(201).json({ categry });
});
export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { categorySlug } = req.params;
  const categry = await categoryModel.findOneAndUpdate(
    { slug: categorySlug },
    req.body,
    { new: true }
  );
  res.json({ categry });
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { categorySlug } = req.params;
  const categry = await categoryModel.findOne({ slug: categorySlug });
  res.json({ message: "deleted success" });
});
