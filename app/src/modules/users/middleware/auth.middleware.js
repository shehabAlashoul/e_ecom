import jwt from "jsonwebtoken";
import { AppError, catchAsyncError } from "../../../../utils/error.handler.js";
import userModel from "../model/users.model.js";



// _________________________________________ check unique email ____________________________________________
export const uniqueEmail = catchAsyncError(async (req, res, next) => {
  const { user_email } = req.body;
  const user = await userModel.findOne({ user_email });
  if (user) throw new AppError("This email is already taken", 400);
  next();
});
export const uniqueEmailupdate = catchAsyncError(async (req, res, next) => {
  const { user_email } = req.body;
  if (req.user.user_email !== user_email) {
    const user = await userModel.findOne({ user_email });
    if (user) throw new AppError("This email is already taken", 400);
  }
  next();
});

// _________________________________________ check if login ____________________________________________
export const authenticate = (req, res, next) => {
  const token = req.header("token");
  if (!token || !token.startsWith("Bearer"))
    throw new AppError("Unauthorized", 401);
  const bearerToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(error.message, 498);
  }
};

// _________________________________________ check role ____________________________________________
export const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.user_role !== role) throw new AppError("Forbidden", 403);
    next();
  };
};
