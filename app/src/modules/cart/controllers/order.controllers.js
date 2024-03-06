import { ApiFeatures } from "../../../../utils/apiFeatures.js";
import { AppError, catchAsyncError } from "../../../../utils/error.handler.js";
import { stripeSession } from "../../../../utils/onlinePayment.js";
import productModel from "../../products/models/product.model.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";

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
  const bulkWriteOptions = cart.products.map(({product_id:{_id},quantity}) => ({
    updateOne:{
        filter:{_id},
        update:{$inc:{
            stock: -quantity
        }}
    }
  }))
  await productModel.bulkWrite(bulkWriteOptions)
  res.json({ message: "done", order });
});

export const makePaymentSession = catchAsyncError(async (req, res) => {
    const success_url = req.header('success_url')
    const cancel_url = req.header('cancel_url')
    const {user_email,user_name} = req.user
    const {_id,total_price} = await cartModel.findOne({user_id: req.user._id})
    const session = await stripeSession(total_price,user_name,_id,user_email,success_url,cancel_url)
    console.log('aaaaaaaaaaaaaaaaaaaa');
    res.json({session})
})