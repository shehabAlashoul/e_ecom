import { Router } from 'express'
import { attachAddQuery, attachDeleteQuery, attachFindQuery, attachUpdateQuery } from '../../../../middlewares/query.middleware.js'
import { executeQuery } from '../../../../handlers/execute.handler.js'
import { validate } from '../../../../middlewares/validation.middleware.js'
import { filterOne, searchQuery } from '../../../../middlewares/features.middleware.js'
import { addCategorySchema, deleteCategorySchema, updateCategorySchema } from '../validations/category.validations.js'
import categoryModel from '../models/category.model.js'
import { upload } from '../../../../middlewares/upload.middleware.js'
import { attachImage } from '../../image/middleware/image.middleware.js'
import { authenticate, authorize } from '../../users/middleware/auth.middleware.js'
import { ROLE } from '../../../../utils/enums.js'
import subcategoriesRouter from './subcategory.routes.js'


const router = Router()

router
	.route('/')
	.get(attachFindQuery(categoryModel),searchQuery(['name']), executeQuery())
	.post(
		authenticate,
		authorize(ROLE.ADMIN),
		upload.single('image'),
		validate(addCategorySchema),
		attachImage('image'),
		attachAddQuery(categoryModel),
		executeQuery({ status: 201 })
	)

router
	.route('/:categorySlug')
	.get(
		attachFindQuery(categoryModel),
		filterOne({ fieldName: 'slug', paramName: 'categorySlug' }),
		executeQuery()
	)
	.put(
		authenticate,
		authorize(ROLE.ADMIN),
		upload.single('image'),
		validate(updateCategorySchema),
		attachImage('image'),
		attachUpdateQuery(categoryModel),
		filterOne({ fieldName: 'slug', paramName: 'categorySlug' }),
		executeQuery()
	)
	.delete(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(deleteCategorySchema),
		attachDeleteQuery(categoryModel),
		filterOne({ fieldName: 'slug', paramName: 'categorySlug' }),
		executeQuery()
	)

router.use('/:categorySlug/subcategories', subcategoriesRouter)

export default router
