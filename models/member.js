const { ObjectID } = require('bson');
var mongoose = require('mongoose');// Setup schema
const Schema = mongoose.Schema;
const newchit=require('./newchit');
var memberschema = mongoose.Schema({

    membername: {
        type: String,
        required: true
    },
    inthesechits:
        [{ type: Object, ref: 'newchit' }]
    ,
    innumberofchits:{
        type:Number
    },
    liftedchits:
        [{ type: Object, ref: 'newchit' }]
    ,
    paidchits:
        [{ type: Object, ref: 'newchit' }],
    memid:{
        type:String
    }
});
// Export user model
var memberuser = module.exports = mongoose.model('member', memberschema,'member');
module.exports.get = function (callback, limit) {
    memberuser.find(callback).limit(limit);
}