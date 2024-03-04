import { Router } from 'express'

import { authenticate, authorize } from '../../users/middleware/auth.middleware.js'
import { attachAddQuery, attachDeleteQuery, attachFindQuery, attachUpdateQuery } from '../../../../middlewares/query.middleware.js'
import { attachCategoryId, filterSubcategories } from '../middlewares/filterSubcategories.middleware.js'
import { executeQuery } from '../../../../handlers/execute.handler.js'
import { validate } from '../../../../middlewares/validation.middleware.js'
import { addSubcategorySchema, deleteSubcategorySchema, updateSubcategorySchema } from '../validations/subcategory.validations.js'
import subcategoryModel from '../models/subcategory.model.js'
import { ROLE } from '../../../../utils/enums.js'
import { filterOne } from '../../../../middlewares/features.middleware.js'

const router = Router({ mergeParams: true })

router
	.route('/')
	.get(
		attachFindQuery(subcategoryModel),
		attachCategoryId(),
		filterSubcategories(),
		executeQuery()
	)
	.post(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(addSubcategorySchema),
		attachCategoryId(),
		attachAddQuery(subcategoryModel),
		executeQuery({ status: 201 })
	)

router
	.route('/:subcategorySlug')
	.get(
		attachFindQuery(subcategoryModel),
		filterOne({ fieldName: 'slug', paramName: 'subcategorySlug' }),
		attachCategoryId(),
		filterSubcategories(),
		executeQuery()
	)
	.put(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(updateSubcategorySchema),
		attachUpdateQuery(subcategoryModel),
		filterOne({ fieldName: 'slug', paramName: 'subcategorySlug' }),
		attachCategoryId(),
		filterSubcategories(),
		executeQuery()
	)
	.delete(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(deleteSubcategorySchema),
		attachDeleteQuery(subcategoryModel),
		filterOne({ fieldName: 'slug', paramName: 'subcategorySlug' }),
		attachCategoryId(),
		filterSubcategories(),
		executeQuery()
	)

export default router
