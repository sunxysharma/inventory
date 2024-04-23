const mongoose = require('mongoose');
const validator = require('validator');
const phoneNumberValidator = {
    validator: function(v) {
        return /^\d{10}$/.test(v);
    },
    message: props => `${props.value} is not a valid phone number! Must have exactly 10 digits.`
};
const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide partner's name!"]
    },  // brand
    email: {
        type: String,
        required: [true, "Please provide partner's email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    phoneNumber: {
        type: String,
        required:  [true, "Please provide partner's phone number!"],
        validate: phoneNumberValidator // Apply custom validator
    },

    role: {
        type: String,
        enum: ['Supplier', 'Distributor'],
    },
    brandId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    }]
    });

    const Partner = mongoose.model('Partner', partnerSchema);

    module.exports = Partner;