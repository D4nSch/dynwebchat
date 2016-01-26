module.exports = function(app, passport) {

// normal routes ===============================================================
    
    app.engine('.html', require('ejs').renderFile);

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // CHAT =========================
    app.get('/chat', isLoggedIn, function(req, res) {
        res.render('chat.html', {
            user : req.user
        });
    });

    // PROFILE =========================
     app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/chat', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        
        
    //verify----------------------------------
    app.post('/verify', function(req, res){
	//Get token and email from GET
	var token = req.body.token;
	var email= req.body.email;
	console.log('Get Token');
		console.log(token);
		console.log(email);

	//Gets User-Model
	var User = require('../app/models/user');

	//Find the user by email
	User.findOne({'local.email' : email}, function(err, user){
		if(err){
			res.end("Token not set");
		}
		if(user){

			if(token===user.local.token){
				user.local.active = true;
				user.save();
				res.redirect(req.get('referer'));

			} else {
				res.redirect(req.get('referer'));
			}
		}
	});
});

   
    
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
