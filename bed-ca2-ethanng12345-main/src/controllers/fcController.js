// Import the required model
const model = require("../models/fcModel.js");

// Middleware to read all fitness challenges
module.exports.readAllfc = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllfc:", error);
      res.status(500).json(error);
    } else {
      
      res.status(200).json(results);
    }
  };

  // Fetch all challenges
  model.selectAll(callback);
};

// Middleware to read a specific user by their ID
module.exports.readUserById = (req, res, next) => {
  const data = {
    id: req.params.id,
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

// Middleware to create a new fitness challenge
module.exports.createNewC = (req, res, next) => {
  // Validate required fields
  if (
   
    req.body.challenge == undefined ||
    req.body.skillpoints == undefined
  ) {
    res.status(400).send("Error: user_id, challenge or skillpoints is undefined");
    return;
  }
  
  const data = {
    user_id: res.locals.userId ,
    challenge: req.body.challenge,
    skillpoints: req.body.skillpoints,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewC:", error);
      res.status(500).json(error);
    } else {
      res.status(201).json({
        challenge_id: results.insertId,
        challenge: data.challenge,
        creator_id: data.user_id,
        skillpoints: data.skillpoints,
      });
    }
  };

  // Insert a new fitness challenge
  model.insertSinglelol(data, callback);
};

// Middleware to update a fitness challenge by its ID
module.exports.updatefcById = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
    user_id: req.body.user_id,
    challenge: req.body.challenge,
    skillpoints: req.body.skillpoints,
  };
 
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updatefcById:", error);
      res.status(500).json(error);
    } else {
      // Check if the challenge exists
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "challenge_id not found",
        });
      } else {
        res.status(200).json({
          challenge_id: data.challenge_id,
          challenge: data.challenge,
          creator_id: data.user_id,
          skillpoints: data.skillpoints,
        });
      }
    }
  };

  // Update the challenge by ID
  model.updateById(data, callback);
};

// Middleware to delete a fitness challenge by its ID
module.exports.deletefcbyID = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteUserfcById:", error);
      res.status(500).json(error);
    } else {
      // Check if the challenge exists
      if (results.affectedRows == 0) {
        res.status(404).json({
          message: "challenge_id not found",
        });
      } else {
        res.status(204).json();
      }
    }
  };

  // Delete the challenge by ID
  model.deleteById(data, callback);
};


// Middleware to verify a user's authorization for a challenge
module.exports.getcreatorid = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
    user_id: req.body.user_id,
    challenge: req.body.challenge,
    skillpoints: req.body.skillpoints,
  };
  if (req.body.challenge == undefined || req.body.skillpoints == undefined || req.body.user_id == undefined) {
    res.status(400).json({
        message: "Error: challenge, skillpoints or user_id is undefined",
    });
    return;
}
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error getcreatorid:", error);
      res.status(500).json(error);
    } else {
      // Check if user exists
      if (results.length === 0) {
        res.status(404).json({
          message: "challenge_id does not exist",
        });
      } else {
        req.creator_id=results[0].creator_id
        if (req.creator_id !== data.user_id) {
          return res.status(403).send("Error: user_id is not the creator");
        }
        
        next()
      }
    }
  };

  // Fetch user by ID
  model.getcreatorid(data, callback);
};