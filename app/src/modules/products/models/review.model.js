import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    minLength: 3,
    maxLength: 10000,
    required: true,
    trim: true,
  },
  reating: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5],
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

reviewSchema.pre(/find/, function (next) {
	this.populate('created_by',['user_name'])
	next()
})

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel
