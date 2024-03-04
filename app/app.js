import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import connectToDB from "./dataBase/conection.js";
import appRouter from "./app.routes.js";
import { AppError } from "./utils/error.handler.js";

const application = (app) => {
  dotenv.config();
  app.use(express.json());
  connectToDB();
  app.use(morgan('dev'))
  app.use("/ecom", appRouter);
  // _________________________________________ cloudnairy config ____________________________________________
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  // _________________________________________ handel error for end point ____________________________________________
  app.all("*", (req, res, next) => {
    throw new AppError("Route not found", 404);
  });
  // _________________________________________ global middleware ____________________________________________
  app.use((error, req, res, next) => {
    const { message, status, stack } = error;
    res
      .status(status || 500)
      .json({ message, ...(process.env.MODE === "development" && { stack }) });
  });
};
export default application;
