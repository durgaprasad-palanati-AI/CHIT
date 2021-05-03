var mongoose = require('mongoose');// Setup schema
var chitschema = mongoose.Schema({

    chitsize: {
        type:Number
    },
    chitvalue:{
        type:Number
    },
    chitperiod:{
        type:Number
    },
    chitmonth:{
        type:Number
    },
    chitmonthsmore:{
        type:Number
    },
    chitpayments:{
        type:Array
    }
    
});
// Export user model
var adminuser = module.exports = mongoose.model('chitadmin', adminschema,'chitadmin');
module.exports.get = function (callback, limit) {
    adminuser.find(callback).limit(limit);
}