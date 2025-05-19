// Import the required user model
const model = require("../models/userModel.js");

// Middleware to fetch all users
module.exports.readAllUser = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            // Log and return a 500 error if fetching users fails
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
        } else {
            // Log results and return the list of users
            
            res.status(200).json(results);
        }
    };

    // Call the model method to fetch all users
    model.selectAll(callback);
};

// Middleware to create a new user
module.exports.createNewUser = (req, res, next) => {
    // Validate that the username is provided
    if (req.body.username == undefined) {
        res.status(400).send("Error: username is undefined");
        return;
    }

    // Data to insert a new user
    const data = {
        username: req.body.username,
    };

    const callback = (error, results, fields) => {
        if (error) {
            // Log and return a 500 error if creation fails
            console.error("Error createNewUser:", error);
            res.status(500).json(error);
        } else {
            // Log results and return the newly created user data
       
            res.status(201).json({
                user_id: results[1][0].user_id,
                username: results[1][0].username,
                skillpoints: results[1][0].skillpoints,
            });
        }
    };

    // Call the model method to insert a new user
    model.insertSingle(data, callback);
};

// Middleware to update a user by ID
module.exports.updateUserById = (req, res, next) => {
    // Validate that both username and skillpoints are provided
    if (req.body.username == undefined || req.body.skillpoints == undefined) {
        res.status(400).json({
            message: "Error: username or skillpoints is undefined",
        });
        return;
    }

    // Data to update the user
    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        skillpoints: req.body.skillpoints,
    };

    const callback = (error, results, fields) => {
        if (error) {
            // Log and return a 500 error if update fails
            console.error("Error updateUserById:", error);
            res.status(500).json(error);
        } else {
            // Check if the user was found and updated
            if (results.affectedRows == 0) {
                res.status(404).json({
                    message: "User_id not found",
                });
            } else {
                // Return the updated user data
                return res.status(200).json({
                    user_id: data.user_id,
                    username: data.username,
                    skillpoints: data.skillpoints,
                });
            }
        }
    };

    // Call the model method to update the user by ID
    model.updateById(data, callback);
};

// Middleware to check if a username already exists
module.exports.readUsername = (req, res, next) => {
    const data = {
        username: req.body.username,
    };

    // Validate that the username is provided
    if (req.body.username == undefined) {
        res.status(400).send("Error: username is undefined");
        return;
    }

    const callback = (error, results, fields) => {
        // Check if the username already exists
        if (results.length != 0) {
            res.status(409).send("Error: username already exists");
        } else {
            // If username doesn't exist, proceed to the next middleware
            next();
        }
    };

    // Call the model method to check the username
    model.check(data, callback);
};

module.exports.register = (req, res, next) =>
    {


        if(req.body.username == undefined || req.body.email == undefined || req.body.password == undefined )
            {
                res.status(400).json({
                    message: "Error: username, email or password is undefined"
                });
                return;
            }
            
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            hash: res.locals.hash
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("register:", error);
                res.status(500).json(error);
            } else {
          
                res.locals.userId = results[1][0].user_id;
                console.log("userid before payload"+ res.locals.userId)
                res.locals.message = `User ${results[1][0].username} created successfully.`;
                next()
            }
        }
        model.insert(data, callback)
    }




    module.exports.login = (req, res, next) =>
        {
            if(req.body.username == undefined || req.body.password == undefined )
                {
                    res.status(400).json({
                        message: "Error: username or password is undefined"
                    });
                    return;
                }
            const data = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
          
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("login:", error);
                    res.status(500).json(error);
                } else {

                    if(results.length ==0 ) 
                        {
                            res.status(404).json({
                                message: 'User not found'
                            });
                        }
                    else {
                    
                    res.locals.userId= results[0].user_id
                    res.locals.hash = results[0].password;
                    next();
                    }
                }
            }
            model.verify2(data, callback)
        }



        module.exports.checkUsernameOrEmailExist = (req, res, next) =>
            {
                const data = {
                   username: req.body.username,
                   email: req.body.email,
                   password: req.body.password
                }
            
                const callback = (error, results, fields) => {
                    if (error) {
                        console.error("checkUsernameOrEmailExist:", error);
                        res.status(500).json(error);
                    } else {
                        if(results.length >0 ) 
                        {
                            res.status(409).json({
                                message: 'Username or email already exists'
                            });
                        }else{
                            next()
                        }
                    }
                }
                model.verify(data, callback)
            }
    // Middleware to fetch all users
module.exports.readUserByid = (req, res, next) => {
  const data = {
    user_id:  res.locals.userId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readUserById:", error);
      res.status(500).json(error);
    } else {
      // Check if user exists
      if (results.length == 0) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json(results[0]);
      }
    }
  };

  // Fetch user by ID
  model.selectById(data, callback);
};


module.exports.readUserByid2 = (req, res, next) => {
    const data = {
      user_id:  req.params.userId,
    };
  
    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error readUserById:", error);
        res.status(500).json(error);
      } else {
        // Check if user exists
        if (results.length == 0) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(results[0]);
        }
      }
    };
  
    // Fetch user by ID
    model.selectById(data, callback);
  };