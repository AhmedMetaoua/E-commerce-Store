import dbConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'PUT') {
        
        const { orderId } = req.body;
        console.log('Received orderId:', orderId);
        
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID required' });
        }
    
        try {
            await Order.findByIdAndUpdate(orderId, { paid: true });
            res.status(200).json({ message: 'Order updated' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating order', error });
        }
    }
}