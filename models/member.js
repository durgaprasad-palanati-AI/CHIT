var mongoose = require('mongoose');// Setup schema
const Schema = mongoose.Schema;
var memberschema = mongoose.Schema({

    membername: {
        type: String,
        required: true
    },
    inthesechits:
        [{ type: Schema.Types.ObjectId, ref: 'newchit' }]
    ,
    innumberofchits:{
        type:Number
    }
    
});
// Export user model
var memberuser = module.exports = mongoose.model('member', memberschema,'member');
module.exports.get = function (callback, limit) {
    memberuser.find(callback).limit(limit);
}