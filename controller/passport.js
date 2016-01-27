// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User       = require('../models/user');

module.exports = function(passport) {

//---------------------------------------------------------------------------------------------------------------
//PASSPORT SESSION SETUP
    
    //required for persistent login sessions
    //passport needs ability to serialize and unserialize users out of session

    //used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

//---------------------------------------------------------------------------------------------------------------
//LOGIN

    passport.use('local-login', new LocalStrategy({
        //by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'User not found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                if (user.local.active === false) 
                    return done(null, false, req.flash('loginMessage', 'Not authenticated yet!'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

//---------------------------------------------------------------------------------------------------------------
//SIGNUP

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        username : 'username',
        usernameField : 'email',
        passwordField : 'password',
		token : 'token',
		active : 'active',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email /*, 'local.username' : username*/ }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.genHash(password);

						usern = email.substring(0, email.lastIndexOf("@"));
						newUser.local.username = usern;

						newUser.local.token = newUser.genToken(email);
						newUser.local.active = false;

//---------------------------------------------------------------------------------------------------------------
//Nodemailer 

                    var nodemailer = require('nodemailer');
                    var transporter = nodemailer.createTransport(
                    {
                            host: "mail.fh-joanneum.at",
                            port: 25
                        });


                        var mailOptions = {
                            from: 'webchat@dynweb.com',
                            to: newUser.local.email,
                            subject: 'Verify your WebChat-account!',
                            text: 'Token: '+newUser.local.token
                        };
          
                        transporter.sendMail(mailOptions, function(err,response){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("Message sent to " + newUser.local.email);
                            }
                        });

                        newUser.save(function(err) {
                            if (err) {
                                return done(err);
                            } else {
                                return done(null, newUser);
                            }
                        });

                    console.log("Email: "+newUser.local.email);
					console.log("Token: "+newUser.local.token); //Token zur Authentifizierung!
                    console.log("Active Account: "+newUser.local.active);

                    }
                });
            } 
        });

    }));
};
