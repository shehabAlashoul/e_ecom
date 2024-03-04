import mongoose from 'mongoose'
import slugify from 'slugify'

const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minLength: 3,
			maxLength: 200,
			required: true,
			trim: true,
			unique: true,
		},
		slug: {
			type: String,
			minLength: 3,
			maxLength: 200,
			trim: true,
			unique: true,
		},
		logo: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'image',
		},
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
	},
	{ timestamps: true }
)
brandSchema.pre('save',function (next) {
	this.slug =slugify(this.name,{lower:true})
	
	next()
})
brandSchema.pre('updateMany',function (next) {
	if (this._update.slug)
	this._update.slug = slugify(this._update.name,{lower:true})
	next()
})

brandSchema.pre(/find/, function (next) {
	this.populate('logo',['path'])
	next()
})

brandSchema.pre(/delete/i,async function(next){
	const deletedBrand = await brandModel.findOne(this._conditions)
	console.log(this._conditions);
	if (!deletedBrand) return next()
	await mongoose.model('image').findByIdAndDelete(deletedBrand.logo)
	next
})

brandSchema.pre(/update/i,async function(next){
	if (!this._update.logo) return next()
	console.log(this._conditions);
	const updatedBrand = await brandModel.findOne(this._conditions)
	if (!updatedBrand) return next()
	await mongoose.model('image').findByIdAndDelete(updatedBrand.logo)
	next
})

const brandModel = mongoose.model('brand', brandSchema)

export default brandModel
