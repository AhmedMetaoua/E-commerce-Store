import dbConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro'

const endpointSecret = 'whsec_1d23a9ebe84a630681e0d9baf39709135f8c055021b988ebe59e14d6f7e5cbd4';

export default async function handler(req, res) {
    await dbConnect()

    let event = req.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];
        try {
        event = stripe.webhooks.constructEvent(
            await buffer(req),
            signature,
            endpointSecret
        );
        } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
        }
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': //payment_intent.succeeded
            const data = event.data.object;
            const orderId = data.metadata.orderId
            const paid = data.payment_status === 'paid'
            if (orderId && paid) {
                await Order.findByIdAndUpdate(orderId, {
                    paid: true,
                })
            }
            console.log(`PaymentIntent for ${data.amount} was successful!`);
            
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).send('ok')
}

export const config = {
    api: {bodyParser: false,}
}