
// controller to define all HTTP methods -> GET/POSt/PATCH/DELETE
const url = require('url');
const mongoose = require('mongoose');
const Product = require('./../models/productModel')
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// exports.checkID = (req,res,next,val) =>{
//     console.log(`Product id is ${val}`);
//     if(req.params.id*1 > products.length){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res, next) =>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: "fail",
//             message : "missing name or price"
//         });
//     };
//     next();
// }
// exports.aliasTopProducts = (req,res,next) =>{
//     req.query.limit = '5';
//     req.query.sort = '-ratingsAverage, price';
//     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//     next();

// }

exports.getAllProducts = catchAsync(async(req, res,next) =>{
    

        // EXECUTE QUERY
        const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const products = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: products.length,
            data:{
                products
            }
        });

    });
    
    exports.getProductByIdOrNameOrBrand = catchAsync(async (req, res, next) => {
        const { identifier } = req.params;
    
        let products;
    
        // Check if the identifier is a valid MongoDB ObjectID
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // If it's a valid ObjectID, fetch the product by ID
            const productById = await Product.findById(identifier);
            if (productById) {
                // If a product is found by ID, return it
                return res.status(200).json({
                    status: 'success',
                    data: {
                        product: productById
                    }
                });
            }
        }
    
        // If it's not a valid ObjectID or no product found by ID, assume it's a name or brand
        // Fetch products by name or brand
        products = await Product.find({
            $or: [
                { product_name: { $regex: new RegExp(identifier, 'i') } }, // Match product_name
                { brandName: { $regex: new RegExp(identifier, 'i') } }      // Match brandName (if applicable)
            ]
        });
    
        if (!products || products.length === 0) {
            return next(new AppError('No products found with the given ID, name, or brand', 404));
        }
    
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
            }
        });
    });
    
    

// exports.getProduct = catchAsync(async(req,res,next) =>{
    
//         console.log(req.query);
//         console.log(req.method, req.url);
//         // console.log(req)
//     const product = await Product.findById(req.params.id);
//     if(!product){
//         return next(new AppError('no product found with that ID',404))
//     }
//     res.status(200).json({
//         status: "success",
//         data:{
//             product
//         }
//     })
// })
// exports.getProductByIdOrBrandName = catchAsync(async (req, res, next) => {
//     const { identifier } = req.params;

//     let product;

//     // Check if the identifier is a valid MongoDB ObjectID
//     if (mongoose.Types.ObjectId.isValid(identifier)) {
//         // If it's a valid ObjectID, fetch the product by ID
//         product = await Product.findById(identifier);
//     } else {
//         // If it's not a valid ObjectID, assume it's a name or brand and fetch the product by name/brand
//         product = await Product.findOne({
//             $or: [
//                 { product_name: { $regex: new RegExp(identifier, 'i') } }, // Match product_name
//                 { brandName: { $regex: new RegExp(identifier, 'i') } }      // Match brandName (if applicable)
//             ]
//         });
//     }

//     if (!product) {
//         return next(new AppError('No product found with the given ID, name, or brand', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             product
//         }
//     });
// });

exports.createProduct = catchAsync(async (req,res,next)=>{
        
const newProduct = await Product.create(req.body)
    // req.body passed in the body of post request
    // console.log("printed")
    res.status(201).json({
        status:"success",
        data:{
            product:newProduct
        }
        })
    })    

exports.addStock = catchAsync(async (req, res, next) => {
        // Validate request body
        if (!req.body.stock) {
            return next(new AppError('Please provide a value to increase the stock by', 400));
        }
        const { stock } = req.body;   // inputs the value TO BE INCREASED BY -> not the new value

        // Use findByIdAndUpdate with specific field update
        const product = await Product.findByIdAndUpdate(
            req.params.id,
          { $inc: { Stock: stock } }, // Increase Stock by provided value
          { new: true, runValidators: true } // Return modified document, skip general validation
        );

        if (!product) {
            return next(new AppError('No such product found in inventory', 404));
        }
        console.log("product added to DB")
        res.status(200).json({
            status: "success",
            data: {
            product
        }
        });
    });

exports.subtractStock = catchAsync(async (req, res, next) => {
        // Validate request body
        if (!req.body.stock) {
            return next(new AppError('Please provide a value to decrease the stock by', 400));
        }
        const { stock } = req.body;
           // inputs the value TO BE INCREASED BY -> not the new value
        
             // Use findByIdAndUpdate with specific field update
        const product = await Product.findByIdAndUpdate(
            req.params.id,
        { $dec: { Stock: stock }}, // decrease Stock by provided value
          { new: true, runValidators: true } // Return modified document, skip general validation
        );
        

        if (!product) {
            return next(new AppError('No such product found in inventory', 404));
        }
        if (product.Stock < 0) {
            return next(new AppError('The product stock cannot be negative. Please enter a lower value to decrease by.', 400));
        }
        res.status(200).json({
            status: "success",
            data: {
            product
        }
        });
    });

exports.updateProduct = catchAsync(async (req,res,next)=>{
    // use patch methods
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true ,// returns the modified document rather than the original
            runValidators: true
        })
        if (!product) {
            return next(new AppError('No such product found in inventory', 404));
        }
        res.status(200).json({
            status: "success",
            data:{
                product
            }
        })
    
    })

exports.deleteProduct =  catchAsync(async (req, res, next)=>{
    
        const product=await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new AppError('No product found with that ID', 404));
        }
        res.status(204).json({
            status: "success",
            data: null
        })
    
    })
    

exports.getProductStats = catchAsync(async (req, res, next) =>{
    
        const stats = await Product.aggregate([   // there ae many stages in aggregation pipeline and each stage has an object
            {
                $match: { ratingsAverage: { $gte: 4.3}}
            },
            {
                $group: {  // group by
                    _id: '$difficulty',
                    numProducts: { $sum:1}, //for each document that goes thorugh this pipeline , 1 is added to the sum , hence it counts the total documents
                    numRatings: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min : '$price'},
                    maxPrice: {$max : '$price'}
                }
            },
            {
                $sort: {// you have to sort acc to the names u specified in the group stage
                    avgPrice: 1 //ascending,
                }
            }
            // },
            // {
            //     $match: { _id: {$ne: 'easy'}// u can repeat stages
            // }
            
            // }
        ])
        res.status(200).json({
            status: "success",
            data:{
                stats
            }
        })
    })

    exports.getMonthlyPlan = catchAsync(async (req, res, next) =>{

    const year = req.params.year*1;
    const plan = await Product.aggregate([
{
    $unwind: '$startDates'
},
{
    $match:{
        startDates: {//Date(year,month,date)
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year+1}-12-31`)
        }
    }
}
,
{
    $group:{
    _id: { $month: '$startDates'}, // apply month on startDates-> to get month from startDates
    numProductStart :{
        $sum:1},
        products:{
            $push : '$name'
        }
    },
    
},
{
    $addFields:{ month: '$_id'} // we want to add month field which takes the value of _id

},
{
    $project:{
        _id:0  // makes visibilty of this field to false
    }
},
{ 
    $sort:{
        numProductStart:-1
    }
},
{
    $limit: 12  // limits the no. of documents to be returned
}
    ])
    res.status(200).json({
            status: "success",
            data:{
                plan
            }
        })
})