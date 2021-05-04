var mongoose = require('mongoose');// Setup schema
var adminschema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    password:{
        type:String
    },
    numberofchits:{
        type:Number
    },
    role:{
        type:String
    }
    
});
// Export user model
var adminuser = module.exports = mongoose.model('chitadmin', adminschema,'chitadmin');
module.exports.get = function (callback, limit) {
    adminuser.find(callback).limit(limit);
}