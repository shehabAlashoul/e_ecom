import dotenv from "dotenv";
import stripe from "stripe";
import express from "express";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import connectToDB from "./dataBase/conection.js";
import appRouter from "./app.routes.js";
import { AppError } from "./utils/error.handler.js";

dotenv.config();
const application = (app) => {

  app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        console.log({checkoutSessionCompleted});
        // Then define and call a function to handle the event checkout.session.completed
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

  // app.listen(4242, () => console.log("Running on port 4242"));
  app.use(express.json());
  connectToDB();
  app.use(morgan("dev"));
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
