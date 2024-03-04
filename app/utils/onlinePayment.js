import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeSession = async (total_price,user_name,user_id,user_email,success_url,cancel_url) =>
    await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    currency:'EGP',
                    unit_amount: total_price * 100,
                    product_data:{
                        name:user_name
                    }
                },
                quantity:1,
            }
        ],
        mode:'payment',
        success_url,
        cancel_url,
        client_reference_id: user_id,
        customer_email: user_email
    })
