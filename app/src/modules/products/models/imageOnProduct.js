import mongoose from 'mongoose'

const imageOnProductSchema = new mongoose.Schema({
	image_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'image',
	},
	product_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'product',
	},
})

imageOnProductSchema.pre(/find/, function (next){
	this.populate('image_id','path')
	next()
})

imageOnProductSchema.pre(/delete/i, async function(next){
	const deletedimage = await imageOnProductModel.findOne(this._conditions)
	if (!deletedimage) return next()
		await mongoose.model('image').findByIdAndDelete(deletedimage.image_id._id)

	next()
})

const imageOnProductModel = mongoose.model(
	'imageOnProduct',
	imageOnProductSchema
)

export default imageOnProductModel
