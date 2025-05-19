const model = require("../models/ucModel.js");

// Controller to create a new challenge record
module.exports.createNewCr = (req, res, next) => {
    // Validate if creation_date is provided in the request body
    if (req.body.creation_date == undefined) {
        res.status(400).send("Error: missing creation_date");
        return;
    }
    
    // Prepare data object for the database operation
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.userId,
        completed: req.body.completed,
        creation_date: req.body.creation_date,
        notes: req.body.notes
    };
    
    // Callback function to handle database response
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewC:", error);
            res.status(500).json(error);
        } else {
            // Check if no rows were affected
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "error" });
            } else {
                // Send success response with the created record details
                return res.status(201).json({
                    complete_id: results.insertId,
                    challenge_id: data.challenge_id,
                    user_id: data.user_id,
                    completed: data.completed,
                    creation_date: data.creation_date,
                    notes: data.notes
                });
            }
        }
    };
    
    // Call model to insert data into the database
    model.insertSingle(data, callback);
};

// Controller to read all challenge records for a specific challenge ID
module.exports.readALLcr = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    // Callback function to handle database response
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readALLcr:", error);
            res.status(500).json(error);
        } else {
            // Check if no results were found
            if (results.length == 0) {
                res.status(404).json({ message: "not found" });
            } else {
                // Convert completed field to boolean for each result
                for (i = 0; i < results.length; i++) {
                    results[i].completed = Boolean(results[i].completed);
                }
                // Send success response with the results
                res.status(200).json(results);
            }
        }
    };

    // Call model to fetch data from the database
    model.selectById(data, callback);
};

// Middleware to check if a challenge record exists
module.exports.checkchallenge = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id
    };

    // Callback function to handle database response
    const callback = (error, results, fields) => {
        // If no record is found, send 404 response
        if (results.length == 0) {
            res.status(404).send({message: "user did not complete the challenge"});
        } else {
            next(); // Proceed to the next middleware or route handler
        }
    };

    // Call model to check the existence of the record
    model.check(data, callback);
};

// Middleware to fetch skillpoints for a specific challenge
module.exports.fetchskillpoints = (req, res, next) => {
  
    const data = {
        challenge_id: req.params.challenge_id
    };

    // Callback function to handle database response
    const callback = (error, results) => {
        if (error) {
            console.error("Error in reward:", error);
            return res.status(500).send("Internal Server Error");
        }

        // If no challenge is found, send 404 response
        if (results.length === 0) {
            return res.status(404).send("Challenge not found");
        }

        // Pass skillpoints to the next middleware
        req.points = results[0].skillpoints;
        next();
    };

    // Call model to fetch skillpoints from the database
    model.updateById(data, callback);
};

// Middleware to update user skillpoints based on challenge completion status
module.exports.updateskillpoints = (req, res, next) => {

    const { completed } = req.body; // Extract the completed status from the request body

    
    const awardedSkillpoints = completed ? req.points : 5; // Determine skillpoints to award

    const data = {
        points: awardedSkillpoints,
        user_id: res.locals.userId
    };

    // Callback function to handle database response
    const callback = (error, results) => {
        if (error) {
            console.error("Error in reward1:", error);
            return res.status(500).send("Internal Server Error");
        }

        next(); // Proceed to the next middleware or route handler
    };

    // Call model to update user skillpoints in the database
    model.points(data, callback);
};
