import mongoose from "mongoose";
import { PAYMENT_TYPE } from "../../../../utils/enums.js";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
        products: [
       {   product:{
		   title: {
			 type: String,
			 trim: true,
		   },
            price: {
              type: Number,
            },
			image:{
				path:{
					type:String,
				}
			}
		},
		quantity: {
			type: Number,
		},
	}
        ],
		coupon:{
			discount:Number
		},
		address:String,
		phone_number:{
			type: String,
			match: /^01[1250][0-9]{8}$/,
		},
		payment_type:{
			type:String,
			enum:[...Object.values(PAYMENT_TYPE)],
			default:PAYMENT_TYPE.cash,
			required:true
		},
		is_paid:{
			type:Boolean,
			default:false,
			required:true,
		},
		is_delivered:{
			type:Boolean,
			default:false,
			required:true
		}
      },
  { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}}
);

orderSchema.virtual("total_price").get(function () {
	const total = this.products.reduce(
	  (acc, entry) => acc + entry.product.price * entry.quantity,
	  0
	  );
	return total 
  });

orderSchema.virtual("total_discounted_price").get(function () {
	const total = this.products.reduce(
	  (acc, entry) => acc + entry.product.price * entry.quantity,
	  0
	  );
	return total - ((this.coupon?.discount || 0) / 100) * total;
  });
const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
