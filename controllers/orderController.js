const url = require('url');
const Order = require('./../models/orderModel')
const APIFeatures = require('../utils/apiFeatures');

exports.getAllOrders = async(req, res) =>  {
    try{

        // EXECUTE QUERY
        const features = new APIFeatures(Order.find().populate('partner_Id'), req.query)
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
    const order = await Order.findById(req.params.id).populate('partner_Id');
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
    
