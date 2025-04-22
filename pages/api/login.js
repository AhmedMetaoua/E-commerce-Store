import dbConnect from '../../lib/mongoose';
import Product from '../../models/Product';
import Category from '../../models/Category';
import User from '@/models/User';
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { userName, email, password } = req.body;

            if (!userName || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const userExist = await User.findOne({email}).select('_id')
            if (userExist) {
                res.status(400).json('User already exists !');
                return ;
            }

            const hashedPwd = await bcrypt.hash(password, 8)
            const user = await User.create({userName, email, password: hashedPwd})
            
            res.status(201).json(user);
        } catch (error) {
            console.error('Error registring user:', error);
            res.status(500).json({ error: error.message });
        }
    }



}
