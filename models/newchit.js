var mongoose = require('mongoose');// Setup schema
const Schema = mongoose.Schema;
const member=require('./member');
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
        type:String
    },
    chitmembers:
        [{ type: Object, ref: 'member' }]
});
// Export user model
var chits = module.exports = mongoose.model('newchit', chitschema,'newchit');
module.exports.get = function (callback, limit) {
    chits.find(callback).limit(limit);
}