import { Router } from "express";
import {
  authenticate,
  authorize,
} from "../../users/middleware/auth.middleware.js";
import { ROLE } from "../../../../utils/enums.js";
import {
  addToCart,
  applyCoupon,
  getCart,
  removeFromCart,
} from "../controllers/cart.controllers.js";
import { assertCart } from "../middleware/cart.middleware.js";


const router = Router();

router.route("/").get(authenticate, authorize(ROLE.USER), assertCart, getCart);
router
  .route("/add")
  .put(authenticate, authorize(ROLE.USER), assertCart, addToCart);
router
  .route("/remove")
  .put(authenticate, authorize(ROLE.USER), assertCart, removeFromCart);
router
	.route('/coupon')
	.put(authenticate, authorize(ROLE.USER), assertCart, applyCoupon)


export default router;
