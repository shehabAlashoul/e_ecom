import mongoose from "mongoose";
import { ROLE, STATUS } from "../../../../utils/enums.js";

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 300,
      lowercase: true,
      required: true,
    },
    user_email: {
      type: String,
      unique: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "enter a valide email"],
      required: true,
    },
    user_password: {
      type: String,
      trim: true,
      required: true,
    },
    user_role: {
      type: String,
      enum: [...Object.values(ROLE)],
      required: true,
      default: ROLE.USER,
    },
    mobileNumber: {
      type: String,
      match: /^01[1250][0-9]{8}$/,
    },
    address: [
      {
          country:{
              type:String,
              lowercase: true,
          },
          addressName:{
              type:String,
              lowercase: true,
          }
      }
  ],
    emailVer: {
      type: Boolean,
      default: false,
    },
    forgetCode: {
      type: String,
    },
    status: {
      type: String,
      enum: [...Object.values(STATUS)],
      default: STATUS.offline,
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model('user',userSchema)

export default userModel