import { Router } from "express";
import { validate } from "../../../../middlewares/validation.middleware.js";
import { changePassword, resetPassword, signInSchema, signUpSchema } from "../validation/auth.validation.js";
import { changeForgetPassword, confirmEmail, forgetPassword, signIn, signUp } from "../controllers/auth.controllers.js";

const router = Router()

// sign up 
router.post('/sign_up',validate(signUpSchema),signUp)
// sign in
router.post('/sign_in',validate(signInSchema),signIn)
// confirm email
router.get('/confirm_email/:token',confirmEmail)
// send code to email
router.patch('/forget_password',validate(resetPassword),forgetPassword)
// change password
router.put('/forget_password/:token',validate(changePassword),changeForgetPassword)

export default router