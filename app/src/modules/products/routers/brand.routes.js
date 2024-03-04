import { Router } from 'express'
import { attachAddQuery, attachDeleteQuery, attachFindQuery, attachUpdateQuery } from '../../../../middlewares/query.middleware.js'
import { executeQuery } from '../../../../handlers/execute.handler.js'
import { validate } from '../../../../middlewares/validation.middleware.js'
import { filterOne, paginateQuery, searchQuery } from '../../../../middlewares/features.middleware.js'
import { upload } from '../../../../middlewares/upload.middleware.js'
import { attachImage } from '../../image/middleware/image.middleware.js'
import { authenticate, authorize } from '../../users/middleware/auth.middleware.js'
import { ROLE } from '../../../../utils/enums.js'
import brandModel from '../models/brand.model.js'
import { addBrandSchema, deleteBrandSchema, updateBrandSchema } from '../validations/brand.validations.js'


const router = Router()

router
	.route('/')
	.get(attachFindQuery(brandModel),searchQuery(['name']), executeQuery())
	.post(
		authenticate,
		authorize(ROLE.ADMIN),
		upload.single('logo'),
		validate(addBrandSchema),
		attachImage('logo'),
		attachAddQuery(brandModel),
		executeQuery({ status: 201 })
	)

router
	.route('/:brandSlug')
	.get(
		attachFindQuery(brandModel),
		filterOne({ fieldName: 'slug', paramName: 'brandSlug' }),
		executeQuery()
	)
	.put(
		authenticate,
		authorize(ROLE.ADMIN),
		upload.single('logo'),
		validate(updateBrandSchema),
		attachImage('logo'),
		attachUpdateQuery(brandModel),
		filterOne({ fieldName: 'slug', paramName: 'brandSlug' }),
		executeQuery()
	)
	.delete(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(deleteBrandSchema),
		attachDeleteQuery(brandModel),
		filterOne({ fieldName: 'slug', paramName: 'brandSlug' }),
		executeQuery()
	)

// router.use('/:categorySlug/subcategories', subcategoriesRouter)

export default router
