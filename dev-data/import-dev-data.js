// copy requirements from server.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({path: './config.env'})
const Product = require('./../models/productModel');

const DB = process.env.DATABASE
mongoose.connect(DB)
    .then(()=>{console.log('Connected to DB')})

const products = JSON.parse(fs.readFileSync(`${__dirname}/product.json`, 'utf8'))

// IMPORT DATA IN DATABASE
const importData = async() =>{
    try{
        await Product.create(products) // creates a new document for each product object in products array
        console.log('data loaded successfully')
    }catch(err){
        console.log(err);
    }

    }
    // delete all existimg DB entries

const deleteData = async()  =>{
    try{
        await Product.deleteMany();
        console.log('data deleted successfully')
        
    }catch(err){
        console.log(err);}
    // }process.exit()
}

    importData();
