import { Router } from 'express'
import { attachAddQuery, attachDeleteQuery, attachFindQuery, attachUpdateQuery } from '../../../../middlewares/query.middleware.js'
import { filterOne, filterQuery, paginateQuery, searchQuery, selectFieldsQuery, sortQuery } from '../../../../middlewares/features.middleware.js'
import productModel from '../models/product.model.js'
import { executeQuery } from '../../../../handlers/execute.handler.js'
import { validate } from '../../../../middlewares/validation.middleware.js'
import { addProductSchema, deleteProductSchema, updateProductSchema } from '../validations/products.validations.js'
import { upload } from '../../../../middlewares/upload.middleware.js'
import { attachCoverImage } from '../middlewares/products.middleware.js'
import { authenticate, authorize } from '../../users/middleware/auth.middleware.js'
import { ROLE } from '../../../../utils/enums.js'
import { addProductWithImages, updateProductWithImages } from '../controllers/products.conrtollers.js'
import reviewRouter from './review.routes.js'



const router = Router()

router
	.route('/')
	.get(
		attachFindQuery(productModel),
		paginateQuery(3),
		sortQuery(),
		selectFieldsQuery(),
		searchQuery(['title', 'description']),
		filterQuery(),
		executeQuery()
	)
	.post(
		authenticate,
		authorize(ROLE.ADMIN),
		upload.fields([{name:'cover_image',maxCount:1},{name:'images',maxCount:10}]),
		validate(addProductSchema),
		attachCoverImage(),
		attachAddQuery(productModel),
		addProductWithImages()
	)

router
	.route('/:productSlug')
	.get(
		attachFindQuery(productModel),
		filterOne({ fieldName: 'slug', paramName: 'productSlug' }),
		executeQuery()
	)
	.put(
		authenticate,
		authorize(ROLE.ADMIN),
		upload.fields([{name:'cover_image',maxCount:1},{name:'images',maxCount:10}]),
		validate(updateProductSchema),
		attachCoverImage(),
		attachUpdateQuery(productModel),
		filterOne({ fieldName: 'slug', paramName: 'productSlug' }),
		updateProductWithImages()
	)
	.delete(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(deleteProductSchema),
		attachDeleteQuery(productModel),
		filterOne({ fieldName: 'slug', paramName: 'productSlug' }),
		executeQuery()
	)

	router.use('/:productSlug/review',reviewRouter)

export default router
