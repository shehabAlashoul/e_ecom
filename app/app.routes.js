import { Router } from "express";

import authRouter from './src/modules/users/routers/auth.routes.js'
import categoryRouter from './src/modules/products/routers/category.routes.js'
import brandRouter from './src/modules/products/routers/brand.routes.js'
import productsRouter from './src/modules/products/routers/products.routes.js'
import couponRouter from "./src/modules/coupon/routers/coupon.routes.js";
import cartRouter from "./src/modules/cart/routers/cart.routes.js";
import orderRouter from "./src/modules/cart/routers/order.routes.js";


const router = Router()

router.use('/auth',authRouter)
router.use('/category',categoryRouter)
router.use('/brand',brandRouter)
router.use('/products',productsRouter)
router.use('/coupon',couponRouter)
router.use('/cart',cartRouter)
router.use('/orders',orderRouter)

export default router