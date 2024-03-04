import Joi from "joi";

 const schemaId = Joi.string().hex().length(24)
 const phone_number = Joi.string().regex(/^01[1250][0-9]{8}$/).required()

export const schemas = {
    schemaId,phone_number
}