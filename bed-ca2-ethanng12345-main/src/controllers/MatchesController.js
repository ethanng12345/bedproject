// Import the required model
const model = require("../models/MatchesModel.js");

// Middleware to validate and check the existence of two boxers for a match
module.exports.checkerboxer = (req, res, next) => {
  // Validate the presence of boxer IDs
  if (req.body.boxer1_id == undefined || req.body.boxer2_id == undefined) {
    res.status(400).send("Error: boxer1_id or boxer2_id is undefined");
    return;
  }
  // Ensure the two boxers are not the same
  if (req.body.boxer1_id === req.body.boxer2_id) {
    res.status(400).send("Error: boxer1_id and boxer2_id cannot be the same");
    return;
  }
  const data = {
    boxer1_id: req.body.boxer1_id,
    boxer2_id: req.body.boxer2_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error in checker:", error);
      return res.status(500).send(error);
    }

    // Verify if both boxers exist
    if (results.length < 2) {
      return res.status(404).send("One or both boxers not found");
    }

    // Assign boxer data to the request object
    const boxer1 = results.find((boxer) => boxer.boxer_id === Number(data.boxer1_id));
    const boxer2 = results.find((boxer) => boxer.boxer_id === Number(data.boxer2_id));


    req.boxer1 = boxer1;
    req.boxer2 = boxer2;
    
    // Proceed to the next middleware
    next();
  };

  // Call the model to check the existence of the boxers
  model.check(data, callback);
};

// Middleware to retrieve weapon and armor multipliers for both boxers
module.exports.getEquipmentMultipliers = (req, res, next) => {
  const boxer1 = req.boxer1;
  const boxer2 = req.boxer2;
 
  
  // Prepare data for querying equipment multipliers
  const data = {
    weapon1: boxer1.weapon_id,
    weapon2: boxer2.weapon_id,
    armor1: boxer1.armor_id,
    armor2: boxer2.armor_id,
  };


  const callback = (error, results) => {
    if (error) {
      console.error("Error fetching equipment multipliers:", error);
      return res.status(500).send("Internal Server Error");
    }

    // Extract multipliers for weapons and armor
    const weaponMultipliers = results[0]; // Weapon multipliers
    const armorMultipliers = results[1];  // Armor multipliers

    // Assign multipliers to the boxers ? check if weaponmultiplier exist
    boxer1.damage_multiplier = weaponMultipliers[1]?.damage_multiplier || 1;
    boxer2.damage_multiplier = weaponMultipliers[0]?.damage_multiplier || 1;

    boxer1.hp_multiplier = armorMultipliers[1]?.hp_multiplier || 1;
    boxer2.hp_multiplier = armorMultipliers[0]?.hp_multiplier || 1;

    // Proceed to the next middleware
    next();
  };

  // Fetch equipment multipliers using the model
  model.getEquipmentMultipliers(data, callback);
};

// Middleware to simulate a match and update coins
module.exports.updateCoins = (req, res, next) => {
  const boxer1 = req.boxer1;
  const boxer2 = req.boxer2;

  // Validate boxer data
  if (!boxer1 || !boxer2) {
    console.error("Boxer data is missing.");
    return res.status(500).send("Boxer data not properly assigned.");
  }

  // Calculate health and damage based on multipliers
  const boxer1HP = boxer1.stamina * boxer1.hp_multiplier;
  const boxer2HP = boxer2.stamina * boxer2.hp_multiplier;
  const boxer1Damage = boxer1.strength * boxer1.damage_multiplier;
  const boxer2Damage = boxer2.strength * boxer2.damage_multiplier;


  // Simulate the match
  let boxer1RemainingHP = boxer1HP;
  let boxer2RemainingHP = boxer2HP;

  while (boxer1RemainingHP > 0 && boxer2RemainingHP > 0) {
    // Boxer 1 attacks
    boxer2RemainingHP -= boxer1Damage;
 
    if (boxer2RemainingHP <= 0) break;

    // Boxer 2 attacks
    boxer1RemainingHP -= boxer2Damage;

  }
// Boxer 1 hp>0, boxer 1 wins else boxer 2 wins
  const winner = boxer1RemainingHP > 0 ? boxer1 : boxer2;
  const loser = boxer1RemainingHP > 0 ? boxer2 : boxer1;

  const coinsEarned = 50;
  const coinsLost = -40;

  const data = {
    winner_id: winner.boxer_id,
    loser_id: loser.boxer_id,
    coins_earned: coinsEarned,
    coins_lost: coinsLost,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updating coins:", error);
      res.status(500).json(error);
    } else {
      req.matchData = {
        winner_id: winner.boxer_id,
        loser_id: loser.boxer_id,
        winner_username:winner.username,
        loser_username:loser.username,
        coins_earned: coinsEarned,
        coins_lost: coinsLost,
      };
      next();
    }
  };

  // Update coins for the boxers
  model.updateBoxerCoins(data, callback);
};

// Middleware to update the profiles of the winner and loser
module.exports.updateProfile = (req, res, next) => {
  const matchData = req.matchData;

  const data = {
    winner_id: matchData.winner_id,
    loser_id: matchData.loser_id,
    winner_username: matchData.winner_username,
    loser_username: matchData.loser_username
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updating profiles:", error);
      res.status(500).json(error);
    } else {
      next();
    }
  };

  // Update boxer profiles using the model
  model.updateBoxerProfile(data, callback);
};

// Middleware to return the match results
module.exports.results = (req, res, next) => {
  const matchData = req.matchData;

  const data = {
    boxer1_id: req.body.boxer1_id,
    boxer2_id: req.body.boxer2_id,
    winner_id: matchData.winner_id,
    coins_earned: matchData.coins_earned,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error recording match results:", error);
      res.status(500).json(error);
    } else {
      res.status(200).json({
        match_id: results.insertId,
        winner: {
          username: matchData.winner_username,
          boxer_id: matchData.winner_id,
          coins_earned: matchData.coins_earned,
        },
        loser: {
          username: matchData.loser_username,
          boxer_id:matchData.loser_id,
          coins_lost: Math.abs(matchData.coins_lost),
        },
      });
    }
  };

  // Save the match results
  model.results(data, callback);
};





// Middleware to show the matches of boxers
module.exports.getMatchesByBoxerID = (req, res) => {
  const data = {
    boxer_id: req.params.boxer_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error fetching matches:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No matches found for this boxer" });
    }

    res.status(200).json({ matches: results });
  };

  model.getMatchesByBoxerID(data, callback);
};

// Middleware to check if boxer exist
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
