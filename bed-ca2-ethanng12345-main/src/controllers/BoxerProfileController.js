// Import the required model
const model = require("../models/BoxerProfileModel.js");

// Middleware to calculate the boxer's level, strength, and stamina based on skill points
module.exports.calculatelevel = (req, res, next) => {
  const data = { user_id: res.locals.userId };

  const callback = (error, results) => {
    if (error) {
      console.error("Error fetching skill points:", error);
      return res.status(500).send("Internal Server Error");
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    const skillpoints = results[0].skillpoints;
 
    const username=results[0].username;


    // Calculate level and remainder skill points
    const calculatedLevel = Math.floor(skillpoints / 100); // Every 100 points = 1 level
    const remainder = skillpoints % 100; // Remaining points after level calculation

    // Calculate new strength and stamina based on level
    const newStrength = 10 + calculatedLevel * 5;
    const newStamina = 10 + calculatedLevel * 5;
    
    // Attach calculated values to the request for later use
    req.calculatedValues = { 
      calculatedLevel, 
      remainder, 
      newStrength, 
      newStamina, 
      skillpoints,
      username
    };

    next();
  };

  // Fetch skill points for the user
  model.getSkillPoints(data, callback);
};

// Middleware to deduct skill points from the user after leveling up
module.exports.deductSkillPointsMiddleware = (req, res, next) => {
  const { remainder } = req.calculatedValues;

  // Ensure the calculation is valid
  if (remainder > 100) {
    return res.status(400).send("calculation error");
  }

  const data = {
    user_id: res.locals.userId,
    remainder
  };

  const callback = (error) => {
    if (error) {
      console.error("Error deducting skill points:", error);
      return res.status(500).send("Internal Server Error");
    }

    next();
  };

  // Deduct skill points from the User table
  model.deductSkillPoints(data, callback);
};

// Middleware to create a new boxer profile
module.exports.createNewProfile = (req, res, next) => {
  const { remainder } = req.calculatedValues;


  const { calculatedLevel, newStrength, newStamina, username } = req.calculatedValues;

  const data = {
    user_id: res.locals.userId,
    level: calculatedLevel,
    strength: newStrength,
    stamina: newStamina,
    username:username
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNewC:", error);
      res.status(500).json(error);
    } else {
      res.status(200).json({
        message: "Boxer profile created successfully",
        boxer_id: results.insertId,
        username: results.username,
        user_id: data.user_id,
        level: data.level,
        strength: data.strength,
        stamina: data.stamina,
        "Remaining skillpoints": remainder
      });
    }
  };

  // Create the new boxer profile
  model.create(data, callback);
};

// Middleware to fetch leaderboard data
module.exports.leaderboard = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error leaderboard:", error);
      res.status(500).json(error);
    } else {
      res.status(200).json({ Leaderboard: results });
    }
  };

  // Fetch leaderboard data from the model
  model.leaderboard(callback);
};

// Middleware to update the boxer's level, strength, and stamina
module.exports.updatelevel = (req, res, next) => {
  // Validate boxer_id
  if (!req.params.boxer_id) {
    return res.status(400).send("Error: boxer_id is undefined.");
  }

  // Ensure calculatedValues exist from the previous middleware
  if (!req.calculatedValues) {
    return res.status(500).send("Missing calculated values from previous middleware.");
  }

  const { calculatedLevel, newStrength, newStamina, remainder } = req.calculatedValues;

  // Check if there are enough skill points for leveling up
  if (calculatedLevel === 0) {
    return res.status(400).json({ message: "Not enough skill points. Minimum of 100 skill points is required." });
}

  const data = {
    boxer_id: req.params.boxer_id,
    level: calculatedLevel,
    strength: newStrength - 10, // Adjust strength to avoid double counting
    stamina: newStamina - 10, // Adjust stamina similarly
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updating boxer profile:", error);
      return res.status(500).json(error);
    }

    // Ensure the updated boxer profile is returned
    const selectResult = results[1][0];

    if (!selectResult) {
      return res.status(404).send("Error: Updated boxer profile not found.");
    }

    res.status(200).json({
      message: "Boxer profile updated successfully",
      boxer_id: selectResult.boxer_id,
      level: selectResult.level,
      strength: selectResult.strength,
      stamina: selectResult.stamina,
      "Remaining skillpoints": remainder
    });
  };

  // Update the level in the model
  model.updatelevel(data, callback);
};

// Middleware to check if user_id matches boxer_id
module.exports.checkids = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    user_id: res.locals.userId ,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error in checker:", error);
      return res.status(500).send(error);
    }

    // Ensure the user_id matches the boxer_id
    if (results.length === 0) {
      return res.status(403).send("User does not own this boxer");
    }

    next();
  };

  // Check the user-boxer relationship
  model.check(data, callback);
};



module.exports.deleteboxerbyID = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error in deleteboxerbyID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Aggregate affectedRows from all queries
    const totalAffectedRows = results.reduce((sum, result) => sum + result.affectedRows, 0);

    // Check if any rows were affected
    if (totalAffectedRows === 0) {
      return res.status(404).json({ message: "Boxer not found" });
    }

    // Successfully deleted
    return res.status(200).json({ message: "Deleted successfully" });
  };

  // Call the model function to delete the boxer
  model.deleteboxerId(data, callback);
};

module.exports.readboxer = (req, res, next) => {
    const data = {
        boxer_id: req.params.boxer_id,
    };


    const callback = (error, results, fields) => {
        // Check if the boxer already exists
        if (results.length === 0) {
            res.status(404).send("Error: boxer does not exists");
        } else {
            
            next();
        }
    };

   
    model.readboxer(data, callback);
};

module.exports.readuser = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
    };


    const callback = (error, results, fields) => {
        // Check if the boxer already exists
        if (results.length === 0) {
            res.status(404).send("Error: user does not exists");
        } else {
            
            next();
        }
    };

   
    model.readuser(data, callback);
};




module.exports.checkuserid = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error in checker:", error);
      return res.status(500).send(error);
    }

    // Ensure the user_id matches the boxer_id
    if (results.length != 0) {
      return res.status(403).send("User already has a boxer");
    }

    next();
  };

  // Check the user-boxer relationship
  model.readuserid(data, callback);
};



module.exports.getboxerinfo = (req, res, next) => {
  const data = {
      user_id: res.locals.userId,
  };


  const callback = (error, results, fields) => {
      // Check if the boxer already exists
      if (results.length === 0) {
          res.status(404).send("Error: user does not exists");
      } else {
          
        res.status(200).json(results);
      }
  };

 
  model.getboxerinfo(data, callback);
};



module.exports.readall = (req, res, next) => {
  const data = {
      boxer_id: req.params.boxer_id,
  };


  const callback = (error, results) => {
    if (error) {
      console.error("Error readAll:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  
    // Ensure results exist before checking its length
    if ( results.length === 0) {
      return res.status(404).send("Error: user does not exist");
    }

    // Respond with the filtered list of boxers
    res.status(200).json(results);
  };


 
  model.selectAllExcept(data, callback);
};