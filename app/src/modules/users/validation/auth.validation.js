import Joi from "joi";
import { ROLE } from "../../../../utils/enums.js";

// >>>>>>>>>>>>>>>>>>>>>>>>>>>> sign up 
export const signUpSchema = Joi.object({
  body: {
    user_name: Joi.string().min(3).max(100).required(),
    user_email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    user_password: Joi.string()
      .required()
      .pattern(
        new RegExp(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        ),
        "Minimum eight characters, at least one letter, one number and one special character"
      ),
    mobileNumber: Joi.string()
      .required()
      .regex(/^01[1250][0-9]{8}$/),
    user_role: Joi.string().valid(...Object.values(ROLE)),
  },
  params: {},
  query: {},
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>> sign in
export const signInSchema = Joi.object({
  body: {
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string()
      .required()
      .pattern(
        new RegExp(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        ),
        "Minimum eight characters, at least one letter, one number and one special character"
      )
        },
  params: {},
  query: {},
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>> send code to email 
export const resetPassword = Joi.object({
    body: {
      user_email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
    },
    params: {},
    query: {},
  });
  
// >>>>>>>>>>>>>>>>>>>>>>>>>>>> change forget password 
  export const changePassword = Joi.object({
    body: {
      user_password: Joi.string()
        .required()
        .pattern(
          new RegExp(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
          ),
          "Minimum eight characters, at least one letter, one number and one special character"
        ),
      code: Joi.string().required(),
    },
    params: {
      token: Joi.string().required(),
    },
    query: {},
  });