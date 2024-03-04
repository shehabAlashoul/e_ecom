import { Router } from "express";
import { authenticate, authorize } from "../../users/middleware/auth.middleware.js";
import { ROLE } from "../../../../utils/enums.js";
import { getUserOrders, makeCashOrder, makePaymentSession } from "../controllers/order.controllers.js";
import { assertCart } from "../middleware/cart.middleware.js";

const orderRouter = Router()

orderRouter.route('/').get(authenticate,authorize(ROLE.USER),getUserOrders)
orderRouter.route('/cash').post(authenticate,authorize(ROLE.USER),assertCart,makeCashOrder)
orderRouter.route('/card').post(authenticate,authorize(ROLE.USER),assertCart,makePaymentSession)

export default orderRouter