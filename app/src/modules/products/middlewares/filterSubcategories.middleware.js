import { catchAsyncError } from "../../../../utils/error.handler.js"
import categoryModel from "../models/category.model.js"


export const filterSubcategories = () =>
	catchAsyncError(async (req, res, next) => {
		req.dbQuery = req.dbQuery.where({ category_id: req.parent._id })
		next()
	})

export const attachCategoryId = () =>
	catchAsyncError(async (req, res, next) => {
		const { categorySlug } = req.params
		const category = await categoryModel.findOne({ slug: categorySlug })
		req.body.category_id = category._id
		req.parent = category
		next()
	})
