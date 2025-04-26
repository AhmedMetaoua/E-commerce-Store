import dbConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";
import Product from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handle(req, res) {
    if(req.method !== 'POST') {
        res.json('should be a post request')
        return
    }

    const {name, email, city, postalCode, streetAddress, country, cartProducts} = req.body;
    console.log('Received checkout data:', req.body);

    await dbConnect();
    const productsIds = cartProducts
    const uniqueIds = [...new Set(productsIds)]
    const productsInfos = await Product.find({_id: uniqueIds})

    let line_items = []
    for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId)
        const quantity = productsIds.filter(id => id === productId)?.length || 0
        if (quantity > 0 && productInfo){
            line_items.push({
                quantity,
                price_data: {
                    currency: 'usd',
                    product_data: {name: productInfo.title},
                    unit_amount: quantity * productInfo.price * 100,
                }
            })
        }
    }

    const orderDoc = await Order.create({ 
        line_items, name, email, city, postalCode, streetAddress, country, paid: false,
    })

    console.log('order id from checkout: ',orderDoc._id.toString())
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/card?success=1&id=' + orderDoc._id.toString(),
        cancel_url: process.env.PUBLIC_URL + '/card?canceled=1',
        metadata: {orderId: orderDoc._id.toString(), test:'ok'},
      });


      res.json({
        url:session.url,
      })

} 