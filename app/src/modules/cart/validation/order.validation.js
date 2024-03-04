import Joi from "joi";
import { schemas } from "../../../../utils/schemas.js";

export const makeCashOrder = Joi.object({
    body:{
        address:Joi.string().required().trim(),
        phone_number: schemas.phone_number.required()
    },
    query:{},
    params:{},
})
export const deleteOrder = Joi.object({
    body:{
        order_id:schemas.schemaId.required()
    },
    query:{},
    params:{},
})