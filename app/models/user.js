// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
		username	 : String,
		token		 : String,
		active		 : Boolean
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Creates a hashed Token
userSchema.methods.generateToken = function(token) {
  return bcrypt.hashSync(token, bcrypt.genSaltSync(8), null);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
