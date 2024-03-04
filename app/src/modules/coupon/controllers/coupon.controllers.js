import { nanoid } from "nanoid";
import { ApiFeatures } from "../../../../utils/apiFeatures.js";
import { AppError, catchAsyncError } from "../../../../utils/error.handler.js";
import couponModel from "../models/coupon.model.js";

export const getCoupons = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(
    couponModel.find(),
    req.query
  ).paginate(10);
  const coupons = await apiFeatures.query;
  res.json({ coupons });
});

export const addcoupon = catchAsyncError(async (req, res) => {
    const num = Math.floor(Math.random() * 6) + 3
    req.body.code = nanoid(num)
  const coupon = await couponModel.create({
    ...req.body,
    created_by: req.user._id,
  });
  res.status(201).json({ coupon });
});

export const updatecoupon = catchAsyncError(async (req, res) => {
  const { couponId } = req.params;
  const coupon = await couponModel.findByIdAndUpdate(
    { _id: couponId},
    req.body,
    { new: true }
  );
  if (!coupon) throw new AppError("coupon not found", 404);
  res.json({ coupon });
});

export const deletecoupon = catchAsyncError(async (req, res) => {
  const { couponId } = req.params;
  const coupon = await couponModel.findByIdAndDelete({
    _id: couponId
  });
  if (!coupon) throw new AppError("coupon not found", 404);
  res.json({ coupon });
});
