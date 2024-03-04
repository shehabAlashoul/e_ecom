import Joi from 'joi'

export const addReviewSchema = Joi.object({
	body: {
		text: Joi.string().min(3).max(200).trim().required(),
		reating:Joi.number().required().valid(1,2,3,4,5)
	},
	params: {productSlug: Joi.string()},
	query: {},
})

export const updateReviewSchema = Joi.object({
	body: {
		name: Joi.string().min(3).max(200).trim(),
		reating:Joi.number().valid(1,2,3,4,5)
	},
	params: { productSlug: Joi.string().required() },
	query: {},
})

export const deleteReviewSchema = Joi.object({
	body: {},
	params: { productSlug: Joi.string().required() },
	query: {},
})
export const getReviewsSchema = Joi.object({
	body: {},
	params: { productSlug: Joi.string().required() },
	query: {},
})
