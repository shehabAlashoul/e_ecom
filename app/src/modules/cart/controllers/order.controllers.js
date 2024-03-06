import Stripe from "stripe";
import dotenv from 'dotenv'
import { ApiFeatures } from "../../../../utils/apiFeatures.js";
import { AppError, catchAsyncError } from "../../../../utils/error.handler.js";
import productModel from "../../products/models/product.model.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";

dotenv.config();
export const getUserOrders = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(
    orderModel.find({ user_id: req.user._id })
  ).paginate();
  const orders = await apiFeatures.query;
  res.json({ orders });
});

export const makeCashOrder = catchAsyncError(async (req, res) => {
  const cart = await cartModel.findOne({ user_id: req.user._id });
  cart.products.forEach((product) => {
    if (product.product_id.stock < product.quantity)
      throw new AppError("Insufficion stock", 400);
  });
  const order = await orderModel.create({
    user_id: req.user._id,
    coupon: {
      discount: cart.coupon_id?.discount || 0,
    },
    products: cart.products.map(
      ({
        product_id: {
          title,
          discounted_price,
          cover_image: { path },
        },
        quantity,
      }) => ({
        quantity,
        product: {
          title,
          price: discounted_price,
          image: { path },
        },
      })
    ),
    ...req.body,
  });

  if (!order) throw new AppError("order faild", 400);
  const bulkWriteOptions = cart.products.map(
    ({ product_id: { _id }, quantity }) => ({
      updateOne: {
        filter: { _id },
        update: {
          $inc: {
            stock: -quantity,
          },
        },
      },
    })
  );
  await productModel.bulkWrite(bulkWriteOptions);
  res.json({ message: "done", order });
});

export const makePaymentSession = catchAsyncError(async (req, res) => {
  const success_url = req.header("success_url");
  const cancel_url = req.header("cancel_url");
  const { user_email, user_name } = req.user;
  const { _id, total_price } = await cartModel.findOne({
    user_id: req.user._id,
  });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "EGP",
          unit_amount: total_price * 100,
          product_data: {
            name: user_name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url,
    cancel_url,
    client_reference_id: _id,
    customer_email: user_email,
  });

  res.json({ session });
});
