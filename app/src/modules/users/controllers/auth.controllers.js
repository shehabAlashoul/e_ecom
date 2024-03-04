import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken'
import { AppError, catchAsyncError } from "../../../../utils/error.handler.js";
import userModel from "../model/users.model.js";
import {sendEmail} from "../../../../utils/email.js";
import { STATUS } from "../../../../utils/enums.js";

// _________________________________________ sign up controller ____________________________________________
export const signUp = catchAsyncError(async (req, res, next) => {
  const { user_name, user_email, user_password, user_role, mobileNumber } =
    req.body;
    const emailToken = jwt.sign({user_email},process.env.EMAIL_SECRET_KEY)
    const link = process.env.BASE_URL+`ecom/auth/confirm_email/${emailToken}`
    const emailVerify = sendEmail({
        to:user_email,
        subject:"click link to confirm your email",
        html : `<a href=${link}>click here?</a>`
      });
  const hashPass = bcrypt.hashSync(user_password, +process.env.ROUNDS);
  const user = await userModel.create({
    user_name,
    user_email,
    user_password: hashPass,
    user_role,
    mobileNumber,
  });
  res.status(201).json({message:`sign up success ${user.user_name}`})
});
// _________________________________________ sign in controller ____________________________________________
export const signIn = catchAsyncError(async (req, res,next) => {
  const {email,password} = req.body
    const user = await userModel.findOne(
      {user_email:email}
    );
    if (!user || !bcrypt.compareSync(password, user.user_password))
		throw new AppError('Invalid credentials', 400)
    await userModel.updateOne(
      {email} ,
      { status: STATUS.online }
    );
    const { _id, user_name, user_role, user_email, mobileNumber } = user;
    const token = jwt.sign(
      { _id, user_name, user_role, user_email, mobileNumber },
      process.env.SECRET_KEY,
      // { expiresIn: "1h" }
    );
    res.status(201).json({ message: `hi ${user.user_name}`, token });
  });
  
  // _________________________________________ confirm email ____________________________________________
  export const confirmEmail = catchAsyncError(async (req, res) => {
    const { token } = req.params;
    try {
      const {user_email} = jwt.verify(token, process.env.EMAIL_SECRET_KEY);
      await userModel.findOneAndUpdate({ user_email: user_email }, { emailVer: true });
      res.send("email is confirmed");
    } catch (err) {
      throw new AppError(err.message, 400);
    }
  });
  
  // _________________________________________ Forget password ____________________________________________
  
  // _________________________________________ send code to email ____________________________________________
  export const forgetPassword = catchAsyncError(async (req, res) => {
    const { user_email } = req.body;
    const user = await userModel.findOne({user_email})
    if (!user) throw new AppError ('email not exist', 404)
    const code = nanoid(8);
  const emailToken = jwt.sign({user_email}, process.env.EMAIL_SECRET_KEY);
  const emailSend = sendEmail({
    to:user_email,
    subject:"reset password",
    html : `<h1>code: ${code}</h1>`
  });
  if (!emailSend) {
    throw new AppError("faild to send this email", 400);
  }
  await userModel.updateOne({user_email},{forgetCode:code})
  res.json({ message: "done",token: emailToken });
  });
  
  // ____________________________ change password _______________________________
  export const changeForgetPassword = catchAsyncError(async (req, res) => {
    const { token } = req.params;
    const {code, user_password } = req.body;
    const {user_email} = jwt.verify(token, process.env.EMAIL_SECRET_KEY);
    const user = await userModel.findOne({user_email})
    if (!user) throw new AppError ('email not exist', 404)
    if (user.forgetCode !== code) throw new AppError('enter right code',404)
    const hashPass = bcrypt.hashSync(user_password, +process.env.SALT);
    await userModel.updateOne({ user_email }, { user_password: hashPass,forgetCode:"" });
    res.json({ message: "password updated successfuly" });
  });
  