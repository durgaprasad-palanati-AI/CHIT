var mongoose = require('mongoose');// Setup schema
var chitschema = mongoose.Schema({
    chitname:{
        type:String
    },

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
    chitstarted:{
        type:String
    },
    chitendson:{
        type:Date
    }
});
// Export user model
var chits = module.exports = mongoose.model('newchit', chitschema,'newchit');
module.exports.get = function (callback, limit) {
    chits.find(callback).limit(limit);
}