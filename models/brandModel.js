const mongoose = require('mongoose')
const slugify = require('slugify');
const validator = require('validator');
const brandSchema = new mongoose.Schema({
    brandName: {
        type: String
    }
})

brandSchema.pre('save', function(next){
    // DOCUMENT middleware only runs on 'save' and create method only
    //DOCUMENT MIDDLEWARE Runs at save command for each document but not for INsertMany()
    this.slug = slugify(this.name, { lower: true}) //logging the document
    next()
})
const Brand = mongoose.model("Brand", brandSchema)
module.exports = Brand;