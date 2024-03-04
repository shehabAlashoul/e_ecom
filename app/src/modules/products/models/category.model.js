import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema(
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
		image: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'image',
			required: true,
		},
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
	},
	{ timestamps: true }
)

categorySchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true })
	next()
})

categorySchema.pre('findOneAndUpdate', function (next) {
	if (this._update.name)
		this._update.slug = slugify(this._update.name, { lower: true })
	next()
})

categorySchema.pre(/find/, function (next) {
	this.populate('image created_by',['path'])
	next()
})

categorySchema.pre(/delete/i,async function(next){
	const deletedCategory = await categoryModel.findOne(this._conditions)
	if (!deletedCategory) return next()
	await mongoose.model('image').findByIdAndDelete(deletedCategory.image)
	next
})

categorySchema.pre(/update/i,async function(next){
	if (!this._update.image) return next()
	const updatedCategory = await categoryModel.findOne(this._conditions)
	if (!updatedCategory) return next()
	await mongoose.model('image').findByIdAndDelete(updatedCategory.image)
	next
})

const categoryModel = mongoose.model('category', categorySchema)

export default categoryModel
