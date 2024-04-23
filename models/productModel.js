const mongoose = require('mongoose')
const slugify = require('slugify');
// const toastify = require('toastify');
const validator = require('validator');
const productSchema = new mongoose.Schema({
    product_name: {         // product is also dependent on warehouse, so it should refer warehouse table
        type: String,
        required: [true, "A product must have a name"],
        
    },
    unitPrice: {
        type: Number,
        required: [true, "A product must have a price"]
    }, 
    Stock:{
        type: Number,
        required: [true, 'A product must have atleast unit stock'],
        default: 1,
        min:1,
        validate: {
            validator: function(v) {
              return Number.isInteger(v) && v > 0; // Check for integer and non-negative value
            },
            message: '{VALUE} is not a valid stock value. Please enter a positive integer.'
        }
    },
    minStock : 
        {
            type: Number,
            required: [true, 'A product must have atleast 1 minimum stock value'],
            default: 1,
            min:1
        },
    
    slug:String,

    unitsPerStock: {
        type: Number,
        required: [true, 'A product must atleast 1 unit per stock'],
        default: 1,
        min:1
    },
    description:{
        type:String,
        required: [true, 'A product must have a description']
    },
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Hardware', 'Stationery','Healthcare','Cosmetics','Furniture','Crockery','Home Furnishing'],
        
    },
    productStatus: {
        type: String,
        enum: ['InStock', 'OutOfStock']
        
    },
    // brandName:{
    //     type:String,
    //     required: [true, 'A product must have a brand']
    // },
    // suplierID
    manufacturing_Date: Date,

    // Continue with the save operation
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
})



productSchema.pre('save', function(next){
    // DOCUMENT middleware only runs on 'save' and create method only
    //DOCUMENT MIDDLEWARE Runs at save command for each document but not for INsertMany()
    this.slug = slugify(this.product_name, { lower: true}) //logging the document
    next()
})
productSchema.pre('save', function(next) {
    
    // Check if minStock is less than or equal to Stock
    if (this.minStock <= this.Stock) {
        const notificationData = {
            text: `Product: ${this.product_name} (ID: ${this._id}) is running low on stock! Place a purchase order`,
            duration: 5000 // Adjust notification display duration in milliseconds
        };

        // Logic to send notification data to the client (implementation depends on your framework)
        // This is a placeholder, replace with your actual mechanism
        console.log('Notification data prepared:', notificationData);
    }

    // Call next to continue with the save operation
    next();
});


// QUERY MIIDLEWARE

productSchema.pre(/^find/, function(next){
    // Query middleware -> for each query before or after an event occurs
this.start = Date.now()
    next()
})
productSchema.post(/^find/, function(docs, next){
    // Query middleware -> for each query before or after an event occurs
    console.log(`Query took ${Date.now() - this.start} milliseconds!`)   
    console.log(docs)
    next()
})
productSchema.pre('aggregate', function(next){
    // aggregation middleware -> for each aggregation before or after an event occurs
    console.log(this.pipeline())
    // this.pipeline().unshift({$match: { secretProduct: { $ne:true}}})
    // unshift inserts ele at beginning of array 
    next()
})
const Product = mongoose.model("Product", productSchema)
module.exports = Product;