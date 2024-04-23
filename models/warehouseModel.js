const mongoose = require('mongoose')
const slugify = require('slugify');
const validator = require('validator');
const warehouseSchema = new mongoose.Schema({
    warehouseCompany: {
        type: String
    },
    warehouseId:{
        type: String
    },
    warehouseAddress: {
        // brand
        // id from warehouse table
        street: {
        type: String,
        //   required: true
        },
        city: {
        type: String,
        //   required: true
        },
        state: {
        type: String,
        //   required: true
        },
        postalCode: {
        type: String,
        //   required: true
        },
        country: {
        type: String,
        default: "India"
        //   required: true
        }
    },
    partnerId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    }]
})

const Warehouse= mongoose.model("Warehouse", warehouseSchema)
module.exports =Warehouse;