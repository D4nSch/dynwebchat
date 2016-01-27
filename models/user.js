//---------------------------------------------------------------------------------------------------------------
//REQUIREMENTS

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//---------------------------------------------------------------------------------------------------------------
//DATABASE SCHEMA

var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
		username	 : String,
		token		 : String,
		active		 : Boolean
    }
});

//---------------------------------------------------------------------------------------------------------------
//FUNCTIONS

//Generate a hashed Password --> authentification
userSchema.methods.genHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Checks if the Password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//Generate a hased Token --> authentification
userSchema.methods.genToken = function(token) {
  return bcrypt.hashSync(token, bcrypt.genSaltSync(8), null);
};

//the created model for users gets exposed to our app
module.exports = mongoose.model('User', userSchema);
