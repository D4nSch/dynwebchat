module.exports = function(app, passport) {

//---------------------------------------------------------------------------------------------------------------
//ROUTES
    
    //lets us also use html, instead of ejs!
    app.engine('.html', require('ejs').renderFile);

    //INDEX
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    //CHAT
    app.get('/chat', isLoggedIn, function(req, res) {
        res.render('chat.html', {
            user : req.user
        });
    });

    //PROFILE
     app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    //LOGOUT
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

//---------------------------------------------------------------------------------------------------------------
//LOGIN
        //show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        //authentification
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/chat', //redirect to the chat
            failureRedirect : '/login', //redirect back to the login
            failureFlash : true //allow flash messages
        }));

//---------------------------------------------------------------------------------------------------------------
//SIGNUP
        //show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        //authentification
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', //redirect to the profile
            failureRedirect : '/signup', //redirect back to the signup page
            failureFlash : true //allow flash messages
        }));
        
        
//---------------------------------------------------------------------------------------------------------------
//VERIFY

        app.post('/verify', function(req, res){

	       var token = req.body.token;
	       var email= req.body.email;

	       //get user-model
	       var User = require('../models/user');

	       //Find the user by email
	       User.findOne({'local.email' : email}, function(err, user){
	           if(err){
	               res.end("Token not set");
		        }
	           if(user){
               if(token===user.local.token){

				user.local.active = true; //set account to active
				user.save();
                console.log("Active Account: "+user.local.active)
				res.redirect(req.get('referer')); //stay on the page (reload)

			    } else {
				res.redirect(req.get('referer'));
			}
		}
	});
});

   
    
};

//route middleware - checks if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
