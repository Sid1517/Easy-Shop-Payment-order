const stripe = require('../../config/stripe')
const userModel = require('../../models/userModel')

const paymentController = async (request, response) => {
    try {
        const { cartItems } = request.body

        
        const user = await userModel.findOne({ _id: request.userId })
        const line_items = cartItems.map((item, index) => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.productId.productName,
                            images: item.productId.productImage.filter(item=>item!==null),
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        unit_amount: Math.round(item.productId.sellingPrice * 100)
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                    
                }
            })
            console.log(line_items)
        const params = {
            submit_type: 'pay',
            mode: "payment",
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {
                    shipping_rate: 'shr_1RXEjWQ1mR8WCYxj7EkjCiQ6'
                }
            ],
            customer_email: user.email,
            metadata: {
                userId: request.userId
            },
            line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancle`,
        }
        
        console.log("session")
        const session = await stripe.checkout.sessions.create(params)
        console.log(session)
        
        response.status(303).json(session)

    } catch (error) {
        response.json({
            message: error?.message || error,
            error: true,
            success: false
        })
    }
}

module.exports = paymentController