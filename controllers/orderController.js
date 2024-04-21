const url = require('url');
const Order = require('./../models/orderModel')
const APIFeatures = require('../utils/apiFeatures');

exports.getAllOrders = async(req, res) =>  {
    try{

        // EXECUTE QUERY
        const features = new APIFeatures(Order.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const orders = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: orders.length,
            data:{
                orders
            }
        });

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
    
};

exports.getOrder = async (req,res) =>{
    try{
        console.log(req.query);
        console.log(req.method, req.url);
        // console.log(req)
    const order = await Order.findById(req.params.id);
    res.status(200).json({
        status: "success",
        data:{
            order
        }
    })
}catch(err){
    res.status(404).json({
        status: 'fail',
        message: err
})}
}
exports.createOrder = async (req,res)=>{
    try{    
const newOrder = await Order.create(req.body)
    // req.body passed in the body of post request
    // console.log("printed")
    res.status(201).json({
        status:"success",
        data:{
            order:newOrder}
        })
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}
    

exports.updateOrder = async (req,res)=>{
    try{// use patch methods
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true ,// returns the modified document rather than the original
            runValidators: true
        })
        res.status(200).json({
            status: "success",
            data:{
                order
            }
        })
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
    }
    

exports.deleteOrder = async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        })
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
    }
    

// exports.getOrderStats = async (req,res)=>{
//     try{
//         const stats = await Order.aggregate([   // there ae many stages in aggregation pipeline and each stage has an object
//             {
//                 $match: { ratingsAverage: { $gte: 4.3}}
//             },
//             {
//                 $group: {  // group by
//                     _id: '$difficulty',
//                     numOrders: { $sum:1}, //for each document that goes thorugh this pipeline , 1 is added to the sum , hence it counts the total documents
//                     numRatings: { $sum: '$ratingsQuantity'},
//                     avgRating: { $avg: '$ratingsAverage' },
//                     avgPrice: {$avg: '$price'},
//                     minPrice: {$min : '$price'},
//                     maxPrice: {$max : '$price'}
//                 }
//             },
//             {
//                 $sort: {// you have to sort acc to the names u specified in the group stage
//                     avgPrice: 1 //ascending,
//                 }
//             }
//             // },
//             // {
//             //     $match: { _id: {$ne: 'easy'}// u can repeat stages
//             // }
            
//             // }
//         ])
//         res.status(200).json({
//             status: "success",
//             data:{
//                 stats
//             }
//         })
//     }catch(err){
//         res.status(400).json({
//             status: "fail",
//             message: err
//         })
//     }
//     }
//     exports.getMonthlyPlan = async (req,res)=>{
// try{
//     const year = req.params.year*1;
//     const plan = await Order.aggregate([
// {
//     $unwind: '$startDates'
// },
// {
//     $match:{
//         startDates: {//Date(year,month,date)
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year+1}-12-31`)
//         }
//     }
// }
// ,
// {
//     $group:{
//     _id: { $month: '$startDates'}, // apply month on startDates-> to get month from startDates
//     numOrderStart :{
//         $sum:1},
//         orders:{
//             $push : '$name'
//         }
//     },
    
// },
// {
//     $addFields:{ month: '$_id'} // we want to add month field which takes the value of _id

// },
// {
//     $project:{
//         _id:0  // makes visibilty of this field to false
//     }
// },
// { 
//     $sort:{
//         numOrderStart:-1
//     }
// },
// {
//     $limit: 12  // limits the no. of documents to be returned
// }

//     ])
//     res.status(200).json({
//             status: "success",
//             data:{
//                 plan
//             }
//         })
// }catch(err){
//     res.status(400).json({
//         status: "fail",
//         message: err
//     })
// }}