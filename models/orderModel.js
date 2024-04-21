const mongoose = require('mongoose')
const slugify = require('slugify');
const validator = require('validator');
const orderSchema = new mongoose.Schema({
    orderName: {
        type: String
    },
    
    orderDate: {
        type: Date,
        required: [true, "An order must have a date"],
        default: Date.now()
    },
    slug:String,
    orderType:{
            type: String,
            enum: ['Sales', 'Purchase', 'Return'],
            
        },

    itemList: { // 2D array -> company and its product required
        type: [String],
        required: [true, 'An order must have an item list']
    },
    status:{
        type:String,
        required: [true, 'An order must have a status']  // if purchase order-> placed order( by manager) / received (by receiving clerk) / returned to supplier(by receiving clerk )
    },
    amount: {// payment status alongside -> pending, completed 
        type: Number,
        required: [true, "An order must have an amount"]
    },    // order status, transaction history, payment details, date and amount
    // then classify payments as green or red for each month depending on order type 
// order lists items 
})

orderSchema.pre('save', function(next){
    // DOCUMENT middleware only runs on 'save' and create method only
    //DOCUMENT MIDDLEWARE Runs at save command for each document but not for INsertMany()
    this.slug = slugify(this.name, { lower: true}) //logging the document
    next()
})
const Order = mongoose.model("Order", orderSchema)
module.exports = Order;