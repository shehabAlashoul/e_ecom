import { Router } from "express";
import { validate } from "../../../../middlewares/validation.middleware.js";
import {
  authenticate,
  authorize,
} from "../../users/middleware/auth.middleware.js";
import { ROLE } from "../../../../utils/enums.js";
import {
  addcoupon,
  deletecoupon,
  getCoupons,
  updatecoupon,
} from "../controllers/coupon.controllers.js";
import {
  addCouponSchema,
  deleteCouponSchema,
  getCouponsSchema,
  updateCouponSchema,
} from "../validation/coupon.validation.js";

const couponRouter = Router();

couponRouter
  .route("/")
  .get(validate(getCouponsSchema), getCoupons)
  .post(
    authenticate,
    authorize(ROLE.ADMIN),
    validate(addCouponSchema),
    addcoupon
  );
couponRouter
  .route("/:couponId")
  .put(
    authenticate,
    authorize(ROLE.ADMIN),
    validate(updateCouponSchema),
    updatecoupon
  )
  .delete(
    authenticate,
    authorize(ROLE.ADMIN),
    validate(deleteCouponSchema),
    deletecoupon
  );

export default couponRouter;
