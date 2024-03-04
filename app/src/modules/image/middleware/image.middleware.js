import { catchAsyncError } from '../../../../utils/error.handler.js';
import { makeImage } from '../utils/image.utils.js';

export const attachImage = (imageFieldName) => catchAsyncError(async (req,res,next)=>{
    if (!req.file) return next()
const image = await makeImage(req.file.path)
    req.body[imageFieldName] = image._id
    next()
})