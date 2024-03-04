import Joi from 'joi'
import { schemas } from '../../../../utils/schemas.js'


export const addCouponSchema = Joi.object({
	body: {
		// code: Joi.string().min(3).max(10).trim().required(),
		expiry: Joi.date().greater('now').required(),
		discount:Joi.number().min(1).required()
	},
	params: {},
	query: {},
})

export const updateCouponSchema = Joi.object({
	body: {
		code: Joi.string().min(3).max(200).trim(),
		expiry: Joi.date(),
		discount:Joi.number()
	},
	params:  {couponId: schemas.schemaId},
	query: {},
})

export const deleteCouponSchema = Joi.object({
	body: {},
	params: { couponId: schemas.schemaId},
	query: {},
})
export const getCouponsSchema = Joi.object({
	body: {},
	params: { couponId: schemas.schemaId},
	query: {},
})
