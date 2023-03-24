import Stripe from 'stripe'
import {v4 as uuidV4 } from 'uuid'
import Cart from '../../models/Cart'
import jwt from 'jsonwebtoken'
import Order from '../../models/Order'
import initDb from '../../helpers/initDB'


initDb()


//const stripe = Stripe(process.env.STRIPE_SECRET)
const stripe=Stripe(process.env.STRIPE_SECRET);


/*

export default async (req,res)=>{
    const {paymentInfo} = req.body
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"you must logged in"})
    }
   
    try{
          const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)    
          const cart = await Cart.findOne({user:userId}).populate("products.product")
          let price  = 0
          cart.products.forEach(item=>{
            price = price + item.quantity * item.product.price
          })
          const prevCustomer = await stripe.customers.list({
              email:paymentInfo.email
          })
          const isExistingCustomer  = prevCustomer.data.length > 0
          let newCustomer
          if(!isExistingCustomer){
               newCustomer =  await stripe.customers.create({
                  email:paymentInfo.email,
                  source:paymentInfo.id
              })
          }

         await stripe.charges.create(
              {
                  currency:"INR",
                  amount: price * 100,
                  receipt_email:paymentInfo.email,
                  customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
                  description:`you purchased a product | ${paymentInfo.email}`
              },{
                idempotencyKey:uuidV4()  
              }
          )
          await new Order({
              user:userId,
              email:paymentInfo.email,
              total:price,
              products:cart.products
          }).save()
          await Cart.findOneAndUpdate(
              {_id:cart._id},
              {$set:{products:[]}}
          )
          res.status(200).json({message:"payment was successful"})





         
    }catch(err){
        console.log(err)
        return res.status(401).json({error:"error processing payment"})
    }
   

}
*/


export default async (req,res)=>{
    const {paymentInfo} = req.body
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"you must logged in"})
    }

    try{
        const {userId} = jwt.verify(authorization,process.env.JWT_SECRET);
        const cart = await Cart.findOne({user:userId}).populate("products.product");
        let price = 0;
        cart.products.forEach(item=>{
            price = price + item.quantity * item.product.price;
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price_data: {
                currency: 'inr',
                product_data: {
                  name: 'Example Product',
                },
                unit_amount: price * 100,
              },
              quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            customer_email: paymentInfo.email
          });

        await new Order({
            user:userId,
            email:paymentInfo.email,
            total:price,
            products:cart.products
        }).save()

        await Cart.findOneAndUpdate(
            {_id:cart._id},
            {$set:{products:[]}}
        );

        res.status(200).json({id: session.id});
    }catch(err){
        console.log(err)
        return res.status(401).json({error:"error processing payment"})
    }
}