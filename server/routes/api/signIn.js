const User = require('../../models/User');
const UserSession = require ('../../models/UserSession');

module.exports = (app) => {
    /*
    * Sign up
    */
    app.post('/api/account/signup', (req, res, next) => {
       const { body } = req;
       const { 
           firstName,
           lastName,
           password,
           homeAddress
       } = body;
       let  { email } = body;

       if(!firstName) {
           return res.send({
               success: false,
               message: 'Error: First name cannot be blank.'
           })
       }
       if(!lastName) {
            return res.send({
                success: false,
                message: 'Error: Last name cannot be blank.'
            })
        }
        if(!email) {
            return res.send({
                success: false,
                message: 'Error: Email name cannot be blank.'
            })
        }
        if(!password) {
            return res.send({
                success: false,
                message: 'Error: Password name cannot be blank.'
            })
        }
        if(!homeAddress) {
            return res.send({
                success: false,
                message: 'Error: Home Address cannot be blank.'
            })
        }

    email = email.toLowerCase();
    email = email.trim();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find({
        email: email,
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                message: 'Error: Account already exists.'
            });
        }
    });

        // Save the new user
        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastname = lastName;
        newUser.homeAddress = homeAddress;
        newUser.password = newUser.generateHash(password);
    
        newUser.save((err, user) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            return res.send({
                success: true,
                message: 'Signed up'
            });
        });
    }); // end of sign up 

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const { 
             password,
        } = body;
        let  { email } = body;

        if(!email) {
            return res.send({
                success: false,
                message: 'Error: Email name cannot be blank.'
            });
        }
        if(!password) {
            return res.send({
                success: false,
                message: 'Error: Password name cannot be blank.'
            });
        }

        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                })
            }

            //invalid password
            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Password'
                });
            }

            // Otherwise connect the user
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: server error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id
                })
            });
        })
    });

    app.get('/api/account/verify', (req, res, next) => {
        // Get the token
        // Verify the token is one of a kind and not deleted
        const { query } = req;
        const { token } = query;

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                return res.send({ 
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        });
    });

    app.get('/api/account/logout', (req, res, next) => {
        // Get the token
        const { query } = req;
        const { token } = query;
        // ?token=test
        // Verify the token is one of a kind and it's not deleted.
        UserSession.findOneAndUpdate({
          _id: token,
          isDeleted: false
        }, {
          $set: {
            isDeleted:true
          }
        }, null, (err, sessions) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }
          return res.send({
            success: true,
            message: 'Good'
          });
        });
      });
};